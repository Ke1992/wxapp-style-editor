// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 请求类
import IndexModel from '../../../shared/apis/IndexModel';
// 定义
import {
    CategoryData,
} from '../../../shared/interface';
// 样式
require('./OptionMenu.scss');
// 定义
interface OptionMenuProps {
    isShowCategory: boolean;
    handleUnfoldEvent: Function;
    getDemoListByCategory: Function;
    updateCategoryPanelStatus: Function;
}
interface OptionMenuState {
    tips: string;
    categories: CategoryData[];
}

export default class OptionMenu extends Component<OptionMenuProps, OptionMenuState> {
    public constructor(props: OptionMenuProps) {
        super(props);

        this.state = {
            tips: '全部',
            categories: [],
        };

        // 绑定函数
        this.getDemoCategories = this.getDemoCategories.bind(this);

        this.handleOutEvent = this.handleOutEvent.bind(this);
        this.handleEnterEvent = this.handleEnterEvent.bind(this);
        this.handleClickEvent = this.handleClickEvent.bind(this);

        // 请求类别数据
        this.getDemoCategories();
    }

    public render(): ReactNode {
        const {
            tips,
            categories,
        } = this.state;
        const {
            isShowCategory,
            handleUnfoldEvent,
        } = this.props;

        return (
            <nav className="tangram-option-menu">
                <div className="tangram-option-item cur">
                    <span
                        onMouseEnter={ (): void => this.handleEnterEvent() }
                        onMouseOut={ (event: React.MouseEvent): void => this.handleOutEvent(event) }
                    >
                        { tips }
                    </span>
                </div>
                <div className="tangram-option-fold">
                    <i
                        className="fas fa-angle-double-right"
                        onClick={ (): void => handleUnfoldEvent() }
                    ></i>
                </div>
                <ul
                    onMouseEnter={ (): void => this.handleEnterEvent() }
                    onMouseOut={ (event: React.MouseEvent): void => this.handleOutEvent(event) }
                    className={ ['tangram-option-category', isShowCategory ? '' : 'hide'].join(' ') }
                >
                    {
                        categories.map((item): ReactNode => {
                            const {
                                key,
                                text,
                            } = item;

                            return (
                                <li
                                    key={ key }
                                    onClick={ (): void => this.handleClickEvent(key, text) }
                                    onMouseEnter={ (): void => this.handleEnterEvent() }
                                    onMouseOut={ (
                                        event: React.MouseEvent,
                                    ): void => this.handleOutEvent(event, true) }
                                >
                                    { text }
                                </li>
                            );
                        })
                    }
                </ul>
            </nav>
        );
    }

    // --------------------数据相关函数--------------------
    /**
     * 获取类别数据
     */
    private getDemoCategories(): void {
        // 请求数据
        IndexModel.category().then(({ errorCode, data }): void => {
            errorCode === 0 && this.setState({
                categories: data as CategoryData[],
            });
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 鼠标移出事件
     */
    private handleOutEvent(event: React.MouseEvent, isChildren = false): void {
        // 阻止事件冒泡
        if (isChildren) {
            event.stopPropagation();
            return;
        }
        const {
            updateCategoryPanelStatus,
        } = this.props;

        // 隐藏面板
        updateCategoryPanelStatus(false);
    }

    /**
     * 鼠标移入事件
     */
    private handleEnterEvent(): void {
        const {
            updateCategoryPanelStatus,
        } = this.props;

        // 显示面板
        updateCategoryPanelStatus(true);
    }

    /**
     * 处理点击事件
     */
    private handleClickEvent(key: string, text: string): void {
        const {
            getDemoListByCategory,
            updateCategoryPanelStatus,
        } = this.props;
        // 更新当前类别名称
        this.setState({
            tips: text,
        });
        // 隐藏面板
        updateCategoryPanelStatus(false);
        // 加载对应类别列表
        getDemoListByCategory(key);
    }
}
