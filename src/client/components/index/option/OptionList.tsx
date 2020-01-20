// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 定义
import {
    DemoListItem,
} from '../../../shared/interface';
// 样式
require('./OptionList.scss');
// 定义
interface OptionListProps {
    current: string;
    loading: boolean;
    list: DemoListItem[];
    isShowCategory: boolean;
    getDemoDetailById: Function;
}
// 常量
const MY_CATEGORY_KEY = 'my';

export default class OptionList extends Component<OptionListProps, {}> {
    public render(): ReactNode {
        const {
            list,
            current,
            loading,
            isShowCategory,
            getDemoDetailById,
        } = this.props;

        return (
            <ul className={ ['tangram-option-list', isShowCategory ? 'blur' : ''].join(' ') }>
                <li className={ ['none', loading || list.length ? 'hide' : ''].join(' ') }>{ current === MY_CATEGORY_KEY ? '您暂未录入UI' : '当前类别暂无数据' }</li>
                {
                    list.map((item): ReactNode => {
                        const {
                            id,
                            name,
                            cover,
                        } = item;

                        return (
                            <li
                                key={ id }
                            >
                                <div
                                    className="tangram-option-content"
                                    onClick={ (): void => getDemoDetailById(id) }
                                >
                                    <img src={ cover } />
                                </div>
                                <div
                                    title={ name }
                                    className="tangram-option-name"
                                >{ name }</div>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}
