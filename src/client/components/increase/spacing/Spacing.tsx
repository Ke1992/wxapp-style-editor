// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./Spacing.scss');

export default class Spacing extends Component<{}, {}> {
    public render(): ReactNode {
        return (
            <section className="tangram-spacing">
                <i className="fas fa-random"></i>
            </section>
        );
    }
}
