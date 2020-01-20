// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./MainDialog.scss');
// 定义
interface Item {
    id: string;
    tips: string;
}
interface MainDialogProps {
    updateEditorStatus: Function;
}
interface MainDialogState {
    list: Item[];
    show: boolean;
    current: string;
}

export default class MainDialog extends Component<MainDialogProps, MainDialogState> {
    public constructor(props: MainDialogProps) {
        super(props);

        this.state = {
            list: [],
            show: false,
            current: '',
        };

        // 绑定函数
        this.show = this.show.bind(this);

        this.handleItemEvent = this.handleItemEvent.bind(this);
        this.handleCancelEvent = this.handleCancelEvent.bind(this);
        this.handleConfirmEvent = this.handleConfirmEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            show,
            list,
            current,
        } = this.state;

        return (
            <div className={ ['tangram-main-dialog', show ? '' : 'hide'].join(' ') }>
                <table className="tangram-main-dialog-table">
                    <tbody>
                        <tr>
                            <td>
                                <div className="tangram-main-dialog-content">
                                    <div className="tangram-main-dialog-title">请选择待编辑项</div>
                                    <ul>
                                        {
                                            list.map((item, index): ReactNode => {
                                                const {
                                                    id,
                                                    tips,
                                                } = item;

                                                return (
                                                    <li
                                                        key={ index }
                                                        className={ current === id ? 'cur' : '' }
                                                        onClick={
                                                            (): void => this.handleItemEvent(id)
                                                        }
                                                    >
                                                        <span></span>
                                                        <div>{ tips }</div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                    <div className="tangram-main-dialog-btns">
                                        <button
                                            className="tangram-main-dialog-cancel"
                                            onClick={ (): void => this.handleCancelEvent() }
                                        >
                                            取 消
                                        </button>
                                        <button
                                            className="tangram-main-dialog-confirm"
                                            onClick={ (): void => this.handleConfirmEvent() }
                                        >
                                            确 定
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    // --------------------页面更新函数--------------------
    /**
     * 显示弹框
     */
    public show(ids: string[]): void {
        const list: Item[] = [];
        // 遍历获取对应的dom内容
        ids.forEach((id): void => {
            // 获取对应的节点内容
            const tips = $('<div></div>').append($(`#${id}`).clone().removeAttr('id').html('')).html();
            // 塞入数组
            list.push({
                id,
                tips,
            });
        });
        // 更新页面数据
        this.setState({
            list,
            show: true,
            current: ids[0],
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 选项点击事件
     * @param id [选择项对应的id值]
     */
    private handleItemEvent(id: string): void {
        this.setState({
            current: id,
        });
    }

    /**
     * 取消按钮点击事件
     */
    private handleCancelEvent(): void {
        this.setState({
            show: false,
        });
    }

    /**
     * 确定按钮点击事件
     */
    private handleConfirmEvent(): void {
        const {
            current,
        } = this.state;

        // 更新编辑区域
        this.props.updateEditorStatus(true, current);
        // 关闭弹框
        this.handleCancelEvent();
    }
}
