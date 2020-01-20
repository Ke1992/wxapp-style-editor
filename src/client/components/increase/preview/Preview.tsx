// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import TopBar from '../../../assets/images/top-bar.png';
// 样式
require('./Preview.scss');

export default class Preview extends Component<{}, {}> {
    public render(): ReactNode {
        return (
            <section className="tangram-preview">
                <div className="tangram-preview-wrap">
                    <img src={ TopBar } className="tangram-preview-top-bar" />
                    <div id="tangram-demo" className="tangram-preview-demo"></div>
                </div>
            </section>
        );
    }
}
