// 库
import React, {
    Component,
    ReactNode,
} from 'react';
import _ from 'lodash';
// 样式
require('./Dialog.scss');
// 定义
interface DialogState {
    show: boolean;
    title: string;
    content: string;
    confirmFunc: Function;
}
interface DialogParam {
    title?: string;
    confirmFunc?: Function;
}

export default class Dialog extends Component<{}, DialogState> {
    public constructor(props: object) {
        super(props);

        this.state = {
            title: '',
            content: '',
            show: false,
            confirmFunc: (): void => {
                // do nothing
            },
        };

        // 绑定函数
        this.handleConfirmEvent = this.handleConfirmEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            show,
            title,
            content,
        } = this.state;

        return (
            <div className={ ['tangram-dialog', show ? '' : 'hide'].join(' ') }>
                <table className="tangram-dialog-table">
                    <tbody>
                        <tr>
                            <td>
                                <div className="tangram-dialog-content">
                                    <div className="tangram-dialog-title">{ title }</div>
                                    <div className="tangram-dialog-tips" dangerouslySetInnerHTML={ { __html: content } }></div>
                                    <div className="tangram-dialog-btns">
                                        <button
                                            className="tangram-dialog-confirm"
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
     * 显示代码结果弹框
     * @param content [异常弹框的内容]
     * @param title   [异常弹框的标题]
     */
    public show(content: string, param: DialogParam | string = '温馨提示'): void {
        const data: DialogParam = _.isString(param) ? {
            title: param,
        } : param;

        // 显示弹框
        this.setState({
            content,
            show: true,
            ...({
                title: '温馨提示',
                confirmFunc: (): void => {
                    // do nothing
                },
                ...data,
            }),
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 确认按钮事件
     */
    private handleConfirmEvent(): void {
        // 更新页面状态
        this.setState({
            show: false,
        });
        // 执行回调
        this.state.confirmFunc();
    }
}
