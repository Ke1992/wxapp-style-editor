// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./Main.scss');

export default class Main extends Component<{}, {}> {
    public render(): ReactNode {
        const {
            children,
        } = this.props;

        return (
            <section className="tangram-main">
                { children }
            </section>
        );
    }
}
