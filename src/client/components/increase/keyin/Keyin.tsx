// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
// 组件
import Dialog from '../../dialog/Dialog';
import KeyinUpload from './KeyinUpload';
import KeyinCategory from './KeyinCategory';
// 定义
import {
    IncreaseData,
} from '../../../shared/interface';
// 样式
require('./Keyin.scss');
// 定义
interface KeyinProps {
    isUpdate: boolean;
}
interface KeyinState {
    cover: string;
    category: string;
    wxmlCode: {
        setValue: Function;
        getValue: Function;
    };
    sassCode: {
        setValue: Function;
        getValue: Function;
    };
    extraSassCode: {
        setValue: Function;
        getValue: Function;
    };
}

export default class Keyin extends Component<KeyinProps, KeyinState> {
    private name: RefObject<HTMLInputElement> = React.createRef();

    private dialog: RefObject<Dialog> = React.createRef();

    private wxml: RefObject<HTMLDivElement> = React.createRef();

    private sass: RefObject<HTMLDivElement> = React.createRef();

    private extraSass: RefObject<HTMLDivElement> = React.createRef();

    public constructor(props: KeyinProps) {
        super(props);

        this.state = {
            cover: '',
            category: '',
            wxmlCode: null,
            sassCode: null,
            extraSassCode: null,
        };

        // 绑定函数
        this.getValue = this.getValue.bind(this);

        this.showDialog = this.showDialog.bind(this);
        this.updateCover = this.updateCover.bind(this);

        this.handleGuideEvent = this.handleGuideEvent.bind(this);
        this.handleCategoryEvent = this.handleCategoryEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            cover,
            category,
        } = this.state;
        const {
            isUpdate,
        } = this.props;

        return (
            <section className="tangram-keyin">
                <div className="tangram-keyin-title">
                    { isUpdate ? '编辑' : '录入' }UI<i
                        onClick={ (): void => this.handleGuideEvent() }
                        className="far fa-question-circle"
                    ></i>
                </div>
                <div className="tangram-keyin-item">
                    <div className="tangram-keyin-item-left">
                        名称：
                    </div>
                    <div className="tangram-keyin-item-right">
                        <input ref={ this.name } />
                    </div>
                </div>
                <div className="tangram-keyin-item">
                    <div className="tangram-keyin-item-left">
                        类别：
                    </div>
                    <div className="tangram-keyin-item-right">
                        <KeyinCategory
                            category={ category }
                            handleCategoryEvent={ this.handleCategoryEvent }
                        />
                    </div>
                </div>
                <div className="tangram-keyin-item">
                    <div className="tangram-keyin-item-left">
                        封面图：
                    </div>
                    <div className="tangram-keyin-item-right">
                        <KeyinUpload
                            cover={ cover }
                            showDialog={ this.showDialog }
                            updateCover={ this.updateCover }
                        />
                    </div>
                </div>
                <div className="tangram-keyin-item">
                    <div className="tangram-keyin-item-left">
                        wxml：
                    </div>
                    <div ref={ this.wxml } className="tangram-keyin-item-right code"></div>
                </div>
                <div className="tangram-keyin-item">
                    <div className="tangram-keyin-item-left">
                        sass：
                    </div>
                    <div ref={ this.sass } className="tangram-keyin-item-right code"></div>
                </div>
                <div className="tangram-keyin-item">
                    <div className="tangram-keyin-item-left">
                        extraSass：
                    </div>
                    <div ref={ this.extraSass } className="tangram-keyin-item-right code"></div>
                </div>
                <Dialog ref={ this.dialog } />
            </section>
        );
    }

    public componentDidMount(): void {
        // 初始化编辑器
        this.setState({
            wxmlCode: CodeMirror(this.wxml.current, {
                lineNumbers: false, // 是否显示行数
                mode: 'text/html', // 显示的类型
                theme: 'oceanic-next', // 主题
            }),
            sassCode: CodeMirror(this.sass.current, {
                lineNumbers: false, // 是否显示行数
                mode: 'text/x-scss', // 显示的类型
                theme: 'oceanic-next', // 主题
            }),
            extraSassCode: CodeMirror(this.extraSass.current, {
                lineNumbers: false, // 是否显示行数
                mode: 'text/x-scss', // 显示的类型
                theme: 'oceanic-next', // 主题
            }),
        });
    }

    // --------------------数据相关函数--------------------
    /**
     * 设置默认值
     * @param data [详情数据]
     */
    public setValue(data: IncreaseData): void {
        const {
            name,
            wxml,
            sass,
            cover,
            category,
            extraSass,
        } = data;

        // 填充名称
        this.name.current.value = name;
        // 填充封面和类别
        this.setState({
            cover,
            category,
        });
        // 填充代码
        this.state.wxmlCode.setValue(wxml);
        this.state.sassCode.setValue(sass);
        this.state.extraSassCode.setValue(extraSass);
    }

    /**
     * 获取用户键入的数据
     */
    public getValue(): IncreaseData {
        const {
            cover,
            category,
            wxmlCode,
            sassCode,
            extraSassCode,
        } = this.state;

        return {
            cover,
            category,
            wxml: wxmlCode.getValue(),
            sass: sassCode.getValue(),
            name: this.name.current.value,
            extraSass: extraSassCode.getValue(),
        };
    }

    // --------------------页面更新函数--------------------
    /**
     * 显示提示弹框
     * @param message [提示消息]
     * @param title   [弹框标题]
     */
    private showDialog(message: string, title = '温馨提示'): void {
        this.dialog.current.show(message, title);
    }

    /**
     * 更新封面图
     * @param cover [封面图url]
     */
    private updateCover(cover: string): void{
        this.setState({
            cover,
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 指引点击事件
     */
    private handleGuideEvent(): void {
        this.dialog.current.show(`1、wxml以 <span style="color: red;">小程序源码</span> 为基准<br>
2、sass代码以 <span style="color: red;">rpx单位</span> 为基准<br>
3、sass代码 <span style="color: red;">不支持变量、嵌套属性、函数等</span> 功能<br>
4、封面图建议尺寸: 750*1206<br>
5、extraSass允许为空，extraSass主要用于控制demo的背景色，范例如下:<br>
#tangram-demo {<br>
&nbsp;&nbsp;&nbsp;&nbsp;background-color: #f7f7f7;<br>
}`, '填写说明');
    }

    /**
     * 类别点击事件
     */
    private handleCategoryEvent(category: string): void {
        this.setState({
            category,
        });
    }
}
