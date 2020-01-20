// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 配置
import SIDEBAR_CONFIG from '../../shared/config/sidebar-config';
// 样式
require('./Sidebar.scss');
// 定义
interface SidebarProps {
    current: string;
    showDialog: Function;
}

export default class Sidebar extends Component<SidebarProps, {}> {
    public render(): ReactNode {
        const {
            current,
        } = this.props;

        return (
            <nav className="tangram-sidebar">
                <ul>
                    {
                        SIDEBAR_CONFIG.map((item): ReactNode => {
                            const {
                                key,
                                link,
                                icon,
                                title,
                            } = item;

                            return (
                                <li
                                    key={ key }
                                    onClick={ (): void => this.handleSidebarEvent(key, link) }
                                    className={ current === key ? 'cur' : '' }
                                >
                                    <div className="tangram-sidebar-icon">
                                        <i className={ icon }></i>
                                    </div>
                                    <div className="tangram-sidebar-tips">{ title }</div>
                                </li>
                            );
                        })
                    }
                </ul>
            </nav>
        );
    }

    // --------------------事件处理函数--------------------
    /**
     * 菜单点击事件
     * @param key  [菜单对应的key]
     * @param link [菜单对应的url]
     */
    private handleSidebarEvent(key: string, link: string): void {
        const {
            current,
        } = this.props;

        // 直接返回
        if (current === key) {
            return;
        }
        // 进行跳转
        window.location.href = link;
    }
}
