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
    Editor,
    Option,
    Result,
} from '../components/index';
import Dialog from '../components/dialog/Dialog';
import Container from '../components/container/Container';
// 请求类
import IndexModel from '../shared/apis/IndexModel';
// 工具类
import CssModelTool from '../shared/tools/CssModelTool';
import ScrollViewTool from '../shared/tools/ScrollViewTool';
// 定义
import {
    Overlap,
    CssModel,
    MainItem,
    CssSource,
    ExtractResult,
    DemoDetailData,
} from '../shared/interface';

interface IndexState {
    id: number; // 当前选中的demo对应的id
    rate: number; // 缩放比例
    cssModel: CssModel; // demo的css数据模型对象
    main: {
        loading: boolean; // 是否加载中
        overlap: Overlap; // 重叠的item数据
        items: MainItem[];
    };
    editor: {
        show: boolean;
        list: CssSource[];
    };
}

/**
 * Index页面
 */
class Index extends Component<{}, IndexState> {
    private main: RefObject<Main> = React.createRef();

    private result: RefObject<Result> = React.createRef();

    private dialog: RefObject<Dialog> = React.createRef();

    private css: RefObject<HTMLStyleElement> = React.createRef();

    private extraCss: RefObject<HTMLStyleElement> = React.createRef();

    public constructor(props: object) {
        super(props);

        this.state = {
            id: 0,
            rate: 50,
            cssModel: {},
            main: {
                items: [],
                overlap: {},
                loading: false,
            },
            editor: {
                list: [],
                show: false,
            },
        };

        // 绑定函数
        this.getDemoDetailById = this.getDemoDetailById.bind(this);
        this.updateCssModel = this.updateCssModel.bind(this);

        this.createMainItems = this.createMainItems.bind(this);
        this.updateEditorStatus = this.updateEditorStatus.bind(this);
        this.updateDemoStyle = this.updateDemoStyle.bind(this);

        this.handleRateEvent = this.handleRateEvent.bind(this);
        this.handleExtractEvent = this.handleExtractEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            id,
            rate,
            main,
            editor,
        } = this.state;

        return (
            <Container current="ui">
                <style ref={ this.css } type="text/css"></style>
                <style ref={ this.extraCss } type="text/css"></style>
                <Tool
                    rate={ rate }
                    handleRateEvent={ this.handleRateEvent }
                    handleExtractEvent={ this.handleExtractEvent }
                />
                <Option
                    getDemoDetailById={ this.getDemoDetailById }
                />
                <Main
                    id={ id }
                    rate={ rate }
                    ref={ this.main }
                    items={ main.items }
                    loading={ main.loading }
                    overlap={ main.overlap }
                    updateEditorStatus={ this.updateEditorStatus }
                />
                <Editor
                    show={ editor.show }
                    list={ editor.list }
                    updateCssModel={ this.updateCssModel }
                />
                <Result ref={ this.result } />
                <Dialog ref={ this.dialog } />
            </Container>
        );
    }

    // --------------------数据相关函数--------------------
    /**
     * 获取demo的相关初始化数据
     */
    private getDemoDetailById(id: number): void {
        // 隐藏编辑区
        this.updateEditorStatus(false);
        // 先显示loading
        this.setState({
            main: {
                items: [],
                overlap: {},
                loading: true,
            },
        });
        // 获取demo相关数据
        IndexModel.detail(id).then(({ errorCode, data, message }): void => {
            // 异常直接返回
            if (errorCode !== 0) {
                this.dialog.current.show(message);
                return;
            }

            const {
                css,
                html,
                cssModel,
                extraCss,
            } = data as DemoDetailData;

            // 填充Demo样式
            this.css.current.innerHTML = css;
            this.extraCss.current.innerHTML = extraCss;
            // 填充Demo结构
            $('#tangram-demo').html(html);
            // 特殊处理scroll-view
            ScrollViewTool.handlePreview();
            // 重置位置
            this.main.current.resetMainPosition();
            // 生成操作区域，需要延迟500ms再次绘制，因为立马绘制有些元素的位置会不精确
            setTimeout((): void => {
                this.setState({
                    id,
                    cssModel,
                    main: {
                        loading: false,
                        ...this.createMainItems(id),
                    },
                });
            }, 500);
        });
    }

    /**
     * 更新demo的css模型数据
     * @param source [待更新的css样式]
     */
    private updateCssModel(source: CssSource[]): void {
        const {
            id,
            cssModel,
        } = this.state;

        // 获取更新后的model数据
        const model = CssModelTool.updateCssToModel(cssModel, source);

        // 更新model到state中
        this.setState({
            cssModel: model,
        });
        // 更新demo样式
        this.updateDemoStyle(model);
        // 重新生成Demo操作的items
        this.setState({
            main: {
                loading: false,
                ...this.createMainItems(id),
            },
        });
    }

    // --------------------页面更新函数--------------------
    /**
     * 生成Demo操作的items
     * @param demoId       [当前demo的id值]
     * @param overlapParam [重叠的item数据]
     * @param containers   [需要遍历的容器]
     * @param index        [当前生成的下标值]
     */
    private createMainItems(demoId: number, overlapParam: Overlap = {}, containers: HTMLElement[] = $('#tangram-demo').toArray(), index = 0): {
        overlap: Overlap;
        items: MainItem[];
    } {
        // 重叠的item数据
        const overlap = overlapParam;
        // 获取缩放比例
        const rate = this.state.rate / 100;
        // 递归结束
        if (!containers.length) {
            return {
                overlap,
                items: [],
            };
        }

        // 当前下标值
        let currentIndex = index;
        // 待递归的子元素
        const result: MainItem[] = [];
        const children: HTMLElement[] = [];
        // page的位置数据
        const pageOffset = $('#tangram-page').offset();

        // 遍历生成
        containers.forEach((item): void => {
            // 遍历所有子元素
            $(item).children().each(function eachEvent(): void {
                // 获取宽高
                const width = $(this).outerWidth();
                const height = $(this).outerHeight();
                // 获取position相关数值
                const top = ($(this).offset().top - pageOffset.top) / rate;
                const left = ($(this).offset().left - pageOffset.left) / rate;
                // 下标值递增
                currentIndex += 1;
                // 生成唯一ID
                const id = `tangram-element-${demoId}-${currentIndex}`;

                // 设置id值
                $(this).attr('id', id);

                // 生成元素加入到区域中
                result.push({
                    id,
                    top,
                    left,
                    width,
                    height,
                });

                // 生成重叠数据
                const key = `${top}-${left}-${width}-${height}`;
                if (_.isUndefined(overlap[key])) {
                    overlap[key] = [];
                }
                overlap[key].push(id);
            });
            // 获取子元素，等待递归
            children.push(...$(item).children().toArray());
        });

        // 进行递归
        const {
            items,
        } = this.createMainItems(demoId, overlap, children, currentIndex);
        result.push(...items);

        // 返回结果
        return {
            overlap,
            items: result,
        };
    }

    /**
     * 更新编辑区域的状态
     * @param show [是否展示编辑区域]
     * @param id   [当前选中的映射ID]
     */
    private updateEditorStatus(show: boolean, id = ''): void {
        const {
            cssModel,
        } = this.state;
        const list = [];

        // 添加列表
        show && list.push(...CssModelTool.getCssFromModel(id, cssModel));

        // 更新数据
        this.setState({
            editor: {
                show,
                list,
            },
        });
    }

    /**
     * 更行Demo的样式
     * @param model [demo的css数据模型对象]
     */
    private updateDemoStyle(model: CssModel): void {
        // 填充Demo样式
        this.css.current.innerHTML = CssModelTool.getStyleFromModel(model);
    }

    // --------------------事件处理函数--------------------
    /**
     * 缩放比例按钮点击事件
     * @param type [缩放类型]
     */
    private handleRateEvent(type: string): void {
        // 获取最新的比例
        const rate = (type === 'increase' ? 1 : -1) * 25 + this.state.rate;

        // 安全值判定
        if (rate < 25) {
            return;
        } if (rate > 400) {
            return;
        }

        // 提高缩放比例
        this.setState({
            rate,
        });
    }

    /**
     * 处理导出按钮点击事件
     * @param type [导出类型: miniprograms、mobile]
     */
    private handleExtractEvent(type: string): void {
        const {
            id,
            cssModel,
        } = this.state;
        const model: CssModel = {};

        // 异常直接返回
        if (id <= 0) {
            this.dialog.current.show('请先选择demo');
            return;
        }

        // 遍历找到需要更新的数据
        _.forEach(cssModel, (value, key): void => {
            if (value.isModified) {
                model[key] = value;
            }
        });

        // 导出代码
        IndexModel.extract(id, type, model).then(({ errorCode, data, message }): void => {
            // 异常直接返回
            if (errorCode !== 0) {
                this.dialog.current.show(message);
                return;
            }
            // 显示结果弹框
            this.result.current.show(ScrollViewTool.handleExtract(type, data as ExtractResult));
        });
    }
}

// 渲染页面
ReactDOM.render(
    <Index></Index>,
    document.getElementById('app'),
);
