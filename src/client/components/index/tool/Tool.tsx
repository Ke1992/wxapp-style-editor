// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./Tool.scss');
// 定义
interface ToolProps {
    rate: number; // 缩放比例
    handleRateEvent: Function; // 缩放比例按钮点击事件
    handleExtractEvent: Function; // 处理导出按钮点击事件
}

export default class Tool extends Component<ToolProps, {}> {
    public render(): ReactNode {
        const {
            rate,
            handleRateEvent,
            handleExtractEvent,
        } = this.props;

        return (
            <section className="tangram-tool">
                <div className="tangram-tool-zoom">
                    <div className="tangram-tool-zoom-in" onClick={(): void => handleRateEvent('reduce')}>
                        <i className="fas fa-minus"></i>
                    </div>
                    <div className="tangram-tool-zoom-tips">{rate}%</div>
                    <div className="tangram-tool-zoom-out" onClick={(): void => handleRateEvent('increase')}>
                        <i className="fas fa-plus"></i>
                    </div>
                </div>
                <div className="tangram-tool-btns">
                    <div className='tangram-tool-btns-tips'>导出: </div>
                    <div
                        className="tangram-tool-btns-mobile"
                        onClick={(): void => handleExtractEvent('mobile')}
                    >
                        <i className="fas fa-mobile-alt"></i>H5
                    </div>
                    <div
                        className="tangram-tool-btns-miniprograms"
                        onClick={(): void => handleExtractEvent('miniprograms')}
                    >
                        <i className="fas fa-code"></i>小程序
                    </div>
                </div>
            </section>
        );
    }
}
