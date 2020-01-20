// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
// 组件
import {
    Main,
    Tool,
    Keyin,
    Spacing,
    Preview,
} from '../components/increase';
import Dialog from '../components/dialog/Dialog';
import Container from '../components/container/Container';
// 请求类
import IncreaseModel from '../shared/apis/IncreaseModel';
// 工具类
import Request from '../shared/tools/Request';
import ScrollViewTool from '../shared/tools/ScrollViewTool';
// 常量
import {
    JUMP_LINK,
} from '../shared/config/base-config';
// 定义
import {
    MockData,
    IncreaseData,
    DemoDetailData,
} from '../shared/interface';

interface IncreaseState {
    id: string;
}

/**
 * Increase页面
 */
class Increase extends Component<{}, IncreaseState> {
    private keyin: RefObject<Keyin> = React.createRef();

    private dialog: RefObject<Dialog> = React.createRef();

    private css: RefObject<HTMLStyleElement> = React.createRef();

    private extraCss: RefObject<HTMLStyleElement> = React.createRef();

    public constructor(props: object) {
        super(props);

        this.state = {
            id: '',
        };

        // 绑定函数
        this.updatePreviewData = this.updatePreviewData.bind(this);
        this.validateSaveData = this.validateSaveData.bind(this);

        this.getDetailData = this.getDetailData.bind(this);

        this.handlePreviewEvent = this.handlePreviewEvent.bind(this);
        this.handleSaveEvent = this.handleSaveEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            id,
        } = this.state;
        const isUpdate = !_.isEmpty(id);

        return (
            <Container current="increase">
                <style ref={ this.css } type="text/css"></style>
                <style ref={ this.extraCss } type="text/css"></style>
                <Tool
                    isUpdate={ isUpdate }
                    handleSaveEvent={ this.handleSaveEvent }
                    handlePreviewEvent={ this.handlePreviewEvent }
                />
                <Main>
                    <Keyin
                        ref={ this.keyin }
                        isUpdate={ isUpdate }
                    />
                    <Spacing />
                    <Preview />
                </Main>
                <Dialog ref={ this.dialog } />
            </Container>
        );
    }

    public componentDidMount(): void {
        // 获取相关参数
        const id = Request.getUrlParam().get('id');

        if (!_.isEmpty(id)) {
            // 更新id值
            this.setState({
                id,
            });
            // 查询一次详情数据
            this.getDetailData(id);
        }
    }

    // --------------------数据相关函数--------------------
    /**
     * 更新预览数据
     * @param param [预览所需要的mock数据]
     */
    private updatePreviewData(param: MockData): void {
        // 获取预览数据
        IncreaseModel.preview(param).then(({ errorCode, data, message }): void => {
            if (errorCode !== 0) {
                this.dialog.current.show(message);
                return;
            }
            // 获取相关数据
            const {
                css,
                html,
                extraCss,
            } = data as DemoDetailData;

            // 填充Demo样式
            this.css.current.innerHTML = css;
            this.extraCss.current.innerHTML = extraCss;
            // 填充Demo结构
            $('#tangram-demo').html(html);
            // 并且滚动到顶部
            $('#tangram-demo').parent().scrollTop(0);
            // 特殊处理scroll-view
            ScrollViewTool.handlePreview();
        });
    }

    /**
     * 校验保存的数据是否合法
     * @param data [待保存的数据]
     */
    private validateSaveData(data: IncreaseData, type = 'save'): boolean {
        const {
            wxml,
            sass,
            name,
            cover,
            category,
        } = data;

        // 是保存操作则先校验重要参数
        if (type === 'save') {
            // 必须填写name
            if (_.isEmpty(name)) {
                this.dialog.current.show('请填写名称');
                return false;
            }

            // 必须选择category
            if (_.isEmpty(category)) {
                this.dialog.current.show('请选择类别');
                return false;
            }

            // 必须选择cover
            if (_.isEmpty(cover)) {
                this.dialog.current.show('请上传封面图');
                return false;
            }
        }

        // 必须填写wxml
        if (_.isEmpty(wxml)) {
            this.dialog.current.show('请填写wxml代码');
            return false;
        }

        // 必须填写sass
        if (_.isEmpty(sass)) {
            this.dialog.current.show('请填写sass代码');
            return false;
        }

        return true;
    }

    // --------------------页面更新函数--------------------
    /**
     * 获取详情数据
     * @param id [待查询demo的id值]
     */
    private getDetailData(id: string): void {
        // 发起请求
        IncreaseModel.detail(id).then(({ errorCode, data }): void => {
            errorCode === 0 && this.keyin.current.setValue(data as IncreaseData);
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 预览按钮点击事件
     */
    private handlePreviewEvent(): void {
        // 获取用户填写的数据
        const data = this.keyin.current.getValue();

        // 进行基础校验
        if (!this.validateSaveData(data, 'preview')) {
            return;
        }

        // 更新预览数据
        this.updatePreviewData(data);
    }

    /**
     * 保存按钮点击事件
     */
    private handleSaveEvent(): void {
        // 获取用户填写的数据
        const {
            id,
        } = this.state;
        const param = this.keyin.current.getValue();

        // 没有通过校验
        if (!this.validateSaveData(param)) {
            return;
        }

        if (_.isEmpty(id)) {
            // 保存
            IncreaseModel.save(param).then(({ errorCode, data, message }): void => {
                // 异常直接返回
                if (errorCode !== 0) {
                    this.dialog.current.show(message, '保存失败');
                    return;
                }

                // 保存成功
                this.dialog.current.show('保存成功', {
                    confirmFunc: (): void => {
                        // 直接重定向到编辑页面
                        window.location.href = `${JUMP_LINK.increase}?id=${data}`;
                    },
                });
            });
        } else {
            // 更新
            IncreaseModel.update(id, param).then(({ errorCode, message }): void => {
                // 异常直接返回
                if (errorCode !== 0) {
                    this.dialog.current.show(message, '更新失败');
                    return;
                }

                // 更新成功
                this.dialog.current.show('更新成功');
            });
        }
    }
}

// 渲染页面
ReactDOM.render(
    <Increase></Increase>,
    document.getElementById('app'),
);
