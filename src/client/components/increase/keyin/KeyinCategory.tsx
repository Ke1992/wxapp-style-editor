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
require('./KeyinCategory.scss');
// 定义
interface KeyinCategoryProps {
    category: string;
    handleCategoryEvent: Function;
}
interface KeyinCategoryState {
    categories: CategoryData[];
}

export default class KeyinCategory extends Component<KeyinCategoryProps, KeyinCategoryState> {
    public constructor(props: KeyinCategoryProps) {
        super(props);

        this.state = {
            categories: [],
        };

        // 绑定函数
        this.getDemoCategories = this.getDemoCategories.bind(this);

        // 请求类别数据
        this.getDemoCategories();
    }

    public render(): ReactNode {
        const {
            category,
            handleCategoryEvent,
        } = this.props;
        const {
            categories,
        } = this.state;

        return (
            <section className="tangram-keyin-category">
                <ul>
                    {
                        categories.slice(1).map((item): ReactNode => {
                            const {
                                key,
                                text,
                            } = item;

                            return (
                                <li
                                    key={ key }
                                    className={ category === key ? 'cur' : '' }
                                    onClick={ (): void => handleCategoryEvent(key) }
                                >
                                    { text }
                                </li>
                            );
                        })
                    }
                </ul>
            </section>
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
}
