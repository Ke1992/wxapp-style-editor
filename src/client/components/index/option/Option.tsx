// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import OptionMenu from './OptionMenu';
import OptionList from './OptionList';
import Loading from '../../loading/Loading';
// 请求类
import IndexModel from '../../../shared/apis/IndexModel';
// 定义
import {
    DemoListItem,
} from '../../../shared/interface';
// 样式
require('./Option.scss');
// 定义
interface OptionProps {
    getDemoDetailById: Function;
}
interface OptionState {
    current: string;
    unfold: boolean;
    loading: boolean;
    list: DemoListItem[];
    isShowCategory: boolean;
}

export default class Option extends Component<OptionProps, OptionState> {
    public constructor(props: OptionProps) {
        super(props);

        this.state = {
            list: [],
            unfold: false,
            loading: true,
            current: 'all',
            isShowCategory: false,
        };
        // 绑定函数
        this.getDemoListByCategory = this.getDemoListByCategory.bind(this);

        this.updateCategoryPanelStatus = this.updateCategoryPanelStatus.bind(this);

        this.handleUnfoldEvent = this.handleUnfoldEvent.bind(this);

        // 首先获取一下列表数据
        this.getDemoListByCategory(this.state.current);
    }

    public render(): ReactNode {
        const {
            list,
            unfold,
            loading,
            current,
            isShowCategory,
        } = this.state;
        const {
            getDemoDetailById,
        } = this.props;

        return (
            <section className={['tangram-option', unfold ? 'unfold' : ''].join(' ')}>
                <OptionMenu
                    isShowCategory={ isShowCategory }
                    handleUnfoldEvent={ this.handleUnfoldEvent }
                    getDemoListByCategory={ this.getDemoListByCategory }
                    updateCategoryPanelStatus={ this.updateCategoryPanelStatus }
                />
                <OptionList
                    list={ list }
                    current={ current }
                    loading={ loading }
                    isShowCategory={ isShowCategory }
                    getDemoDetailById={ getDemoDetailById }
                />
                <Loading
                    loading={ loading }
                />
            </section>
        );
    }

    /**
     * 根据category获取demo列表
     * @param category [筛选的类型]
     */
    private getDemoListByCategory(category: string): void {
        // 先显示loading
        this.setState({
            list: [],
            loading: true,
        });
        // 获取列表数据
        IndexModel.list(category).then((result): void => {
            const list = result.data as DemoListItem[];

            // 更新数据
            setTimeout((): void => {
                this.setState({
                    list,
                    loading: false,
                    current: category,
                });
            }, 250);
        });
    }

    // --------------------页面更新函数--------------------
    /**
     * 更新类别面板状态
     * @param isShowCategory [是否展示类别面板]
     */
    private updateCategoryPanelStatus(isShowCategory: boolean): void {
        // 更新面板状态
        this.setState({
            isShowCategory,
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 展开点击事件
     */
    private handleUnfoldEvent(): void {
        const {
            unfold,
        } = this.state;

        this.setState({
            unfold: !unfold,
        });
    }
}
