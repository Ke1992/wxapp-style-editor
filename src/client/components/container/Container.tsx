// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
// 组件
import Header from '../header/Header';
import Dialog from '../dialog/Dialog';
import Sidebar from '../sidebar/Sidebar';
// 样式
require('./Container.scss');
// 定义
interface ContainerProps {
    current: string;
}

export default class Container extends Component<ContainerProps, {}> {
    private dialog: RefObject<Dialog> = React.createRef();

    public constructor(props: ContainerProps) {
        super(props);

        // 绑定函数
        this.showDialog = this.showDialog.bind(this);
    }

    public render(): ReactNode {
        const {
            current,
            children,
        } = this.props;

        return (
            <div>
                <Header />
                <Sidebar
                    current={ current }
                    showDialog={ this.showDialog }
                />
                <main className="tangram-container">
                    { children }
                </main>
                <Dialog ref={ this.dialog } />
            </div>
        );
    }

    // --------------------页面更新函数--------------------
    /**
     * 显示提示弹框
     * @param message [提示消息]
     * @param title   [弹框标题]
     */
    private showDialog(message: string, title = '温馨提示'): void {
        this.dialog.current.show(message, title);
    }
}
