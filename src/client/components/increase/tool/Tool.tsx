// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./Tool.scss');
// 定义
interface ToolProps {
    isUpdate: boolean;
    handleSaveEvent: Function;
    handlePreviewEvent: Function;
}

export default class Tool extends Component<ToolProps, {}> {
    public render(): ReactNode {
        const {
            isUpdate,
            handleSaveEvent,
            handlePreviewEvent,
        } = this.props;

        return (
            <section className="tangram-tool">
                <div className="tangram-tool-btns">
                    <div
                        onClick={ (): void => handlePreviewEvent() }
                        className="tangram-tool-btns-mobile"
                    >
                        <i className="fas fa-eye"></i>预览
                    </div>
                    <div
                        onClick={ (): void => handleSaveEvent() }
                        className="tangram-tool-btns-miniprograms"
                    >
                        <i className="fas fa-pen"></i>{ isUpdate ? '更新' : '保存' }
                    </div>
                </div>
            </section>
        );
    }
}
