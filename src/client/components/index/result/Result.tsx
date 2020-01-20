// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
// 组件
import Dialog from '../../dialog/Dialog';
// 定义
import {
    ExtractResult,
} from '../../../shared/interface';
// 样式
require('./Result.scss');
// 定义
interface ResultState extends ExtractResult {
    type: string;
    show: boolean;
    codemirror: {
        setValue: Function;
        setOption: Function;
    };
}

export default class Result extends Component<{}, ResultState> {
    private dialog: RefObject<Dialog> = React.createRef();

    private code: RefObject<HTMLDivElement> = React.createRef();

    public constructor(props: object) {
        super(props);

        this.state = {
            css: '',
            sass: '',
            html: '',
            wxml: '',
            type: '',
            show: false,
            codemirror: null,
        };

        // 绑定函数
        this.handleGuideEvent = this.handleGuideEvent.bind(this);
        this.handleCloseEvent = this.handleCloseEvent.bind(this);
        this.handleCodeEvent = this.handleCodeEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            show,
            wxml,
            html,
            type,
        } = this.state;

        return (
            <section className={['tangram-result', show ? '' : 'hide'].join(' ')}>
                <div className="tangram-result-content">
                    <div className="tangram-result-title">
                        <span>源码</span><i
                            className="far fa-question-circle"
                            onClick={ (): void => this.handleGuideEvent() }
                        ></i>
                        <div
                            onClick={ (): void => this.handleCloseEvent() }
                        >
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div className="tangram-result-main">
                        <ul>
                            <li
                                onClick={ (): void => this.handleCodeEvent('wxml') }
                                className={ [wxml ? '' : 'hide', type === 'wxml' ? 'cur' : ''].join(' ') }
                            >
                                wxml
                            </li>
                            <li
                                onClick={ (): void => this.handleCodeEvent('html') }
                                className={ [html ? '' : 'hide', type === 'html' ? 'cur' : ''].join(' ')}
                            >
                                html
                            </li>
                            <li
                                onClick={ (): void => this.handleCodeEvent('sass') }
                                className={ type === 'sass' ? 'cur' : '' }
                            >
                                sass
                            </li>
                            <li
                                onClick={ (): void => this.handleCodeEvent('css') }
                                className={ type === 'css' ? 'cur' : '' }
                            >
                                css
                            </li>
                        </ul>
                        <div ref={ this.code } className="tangram-result-code"></div>
                    </div>
                </div>
                <Dialog ref={ this.dialog } />
            </section>
        );
    }

    public componentDidMount(): void {
        // 初始化编辑器
        this.setState({
            codemirror: CodeMirror(this.code.current, {
                lineNumbers: false, // 是否显示行数
                theme: 'oceanic-next', // 主题
            }),
        });
    }

    // --------------------页面更新函数--------------------
    /**
     * 显示代码结果弹框
     * @param param [导出代码的结果对象]
     */
    public show(param: ExtractResult): void {
        const {
            wxml,
            html,
        } = param;
        // 显示弹框
        this.setState({
            ...param,
            show: true,
            type: wxml ? 'wxml' : 'html',
        });
        // 变更模式
        this.state.codemirror.setOption('mode', 'text/html');
        // 渲染结果
        this.state.codemirror.setValue(wxml || html);
    }

    // --------------------事件处理函数--------------------
    /**
     * 指引点击事件
     */
    private handleGuideEvent(): void {
        this.dialog.current.show(`css使用rem单位，rem的大小基础建立在以下样式: <br><div style="height: 6px;"></div>
html {<br>
&nbsp;&nbsp;&nbsp;&nbsp;font-size: 20px;<br>
&nbsp;&nbsp;&nbsp;&nbsp;font-size: 5.33333vw;<br>
}`, '源码说明');
    }

    /**
     * 处理关闭事件
     */
    private handleCloseEvent(): void {
        this.setState({
            show: false,
        });
    }

    /**
     * 处理源码切换事件
     * @param type [类型: wxml、html、sass、css]
     */
    private handleCodeEvent(type: string): void {
        const {
            css,
            sass,
            wxml,
            html,
        } = this.state;
        let mode = 'text/html';
        let value = wxml || html;

        // 切换tab
        this.setState({
            type,
        });

        if (type === 'sass') {
            mode = 'text/x-scss';
            value = sass;
        } else if (type === 'css') {
            mode = 'text/css';
            value = css;
        }

        // 变更模式
        this.state.codemirror.setOption('mode', mode);
        // 渲染结果
        this.state.codemirror.setValue(value);
    }
}
