// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 基础定义
import {
    MainLine as Line,
} from '../../../shared/interface';
// 样式
require('./MainLine.scss');
// 定义
interface MainLineProps {
    data: Line;
}

export default class MainLine extends Component<MainLineProps, {}> {
    public render(): ReactNode {
        const {
            data: {
                show,
                top,
                left,
                width,
                height,
            },
        } = this.props;

        return (
            <div className={['tangram-main-line', show ? '' : 'hide'].join(' ')}>
                <div
                    style={
                        {
                            left,
                            width,
                        }
                    }
                    className="tangram-main-line-vertical"
                ></div>
                <div
                    style={
                        {
                            top,
                            height,
                        }
                    }
                    className="tangram-main-line-horizontal"
                ></div>
            </div>
        );
    }
}
