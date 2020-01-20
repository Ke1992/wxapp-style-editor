// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 基础定义
import {
    MainItem as Item,
} from '../../../shared/interface';
// 样式
require('./MainItem.scss');
// 定义
interface MainItemProps {
    data: Item;
    updateLineStatus: Function;
    updateEditorStatus: Function;
    updateDialogStatus: Function;
}

export default class MainItem extends Component<MainItemProps, {}> {
    public constructor(props: MainItemProps) {
        super(props);

        // 绑定函数
        this.handleOutEvent = this.handleOutEvent.bind(this);
        this.handleClickEvent = this.handleClickEvent.bind(this);
        this.handleEnterEvent = this.handleEnterEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            data: {
                top,
                left,
                width,
                height,
            },
        } = this.props;

        return (
            <div
                style= {
                    {
                        top,
                        left,
                        width,
                        height,
                    }
                }
                className="tangram-main-item"
                onMouseOut={ (): void => this.handleOutEvent() }
                onClick={ (event: React.MouseEvent): void => this.handleClickEvent(event) }
                onMouseEnter={ (event: React.MouseEvent): void => this.handleEnterEvent(event) }
            >
                <div className="tangram-main-item-top-left"></div>
                <div className="tangram-main-item-top-right"></div>
                <div className="tangram-main-item-bottom-left"></div>
                <div className="tangram-main-item-bottom-right"></div>
            </div>
        );
    }

    // --------------------事件处理函数--------------------
    /**
     * 鼠标点击事件
     * @param event [点击事件对象]
     */
    private handleClickEvent(event: React.MouseEvent): void {
        const {
            data: {
                id,
            },
            data,
            updateEditorStatus,
            updateDialogStatus,
        } = this.props;

        $(event.target).addClass('selected')
            // 兄弟节点移除选中态
            .siblings().removeClass('selected');
        // 隐藏虚线
        this.handleOutEvent();
        // 显示编辑面板
        updateDialogStatus(data) && updateEditorStatus(true, id);
        // 阻止事件冒泡
        event.stopPropagation();
    }

    /**
     * 鼠标移出事件
     */
    private handleOutEvent(): void {
        const {
            updateLineStatus,
        } = this.props;

        // 更新Line的状态
        updateLineStatus({
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            show: false,
        });
    }

    /**
     * 鼠标移入事件
     */
    private handleEnterEvent(event: React.MouseEvent): void {
        const {
            data: {
                top,
                left,
                width,
                height,
            },
            updateLineStatus,
        } = this.props;

        // 当前是选中状态，直接返回
        if ($(event.target).hasClass('selected')) {
            return;
        }

        // 更新Line的状态
        updateLineStatus({
            top,
            left,
            width,
            height,
            show: true,
        });
    }
}
