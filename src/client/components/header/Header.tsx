// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import Logo from '../../assets/images/logo.png';
// 样式
require('./Header.scss');

export default class Header extends Component<{}, {}> {
    public render(): ReactNode {
        return (
            <header className="tangram-header">
                <div className="tangram-header-logo">
                    <img src={ Logo } />
                </div>
                <div className="tangram-header-name">Tangram</div>
            </header>
        );
    }
}
