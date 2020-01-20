// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./Loading.scss');
// 定义
interface LoadingProps {
    type?: string;
    loading: boolean;
}

export default class Loading extends Component<LoadingProps, {}> {
    private static defaultProps = {
        type: 'normal',
    };

    public render(): ReactNode {
        const {
            type,
            loading,
        } = this.props;

        return (
            <div className={ ['tangram-loading', loading ? '' : 'hide'].join(' ') }>
                <div className={ ['tangram-loading-content', type].join(' ') }>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={ ['tangram-loading-tips', type].join(' ') }>加载中...</div>
            </div>
        );
    }
}
