// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
// 组件
import MainLine from './MainLine';
import MainItem from './MainItem';
import MainDialog from './MainDialog';
import Loading from '../../loading/Loading';
import TopBar from '../../../assets/images/top-bar.png';
// 常量
import {
    JUMP_LINK,
} from '../../../shared/config/base-config';
// 定义
import {
    Overlap,
    MainLine as Line,
    MainItem as Item,
} from '../../../shared/interface';
// 样式
require('./Main.scss');
// 定义
interface MainProps {
    id: number; // demo对应的id值
    rate: number; // 缩放比例
    items: Item[];
    loading: boolean;
    overlap: Overlap; // 重叠的item数据
    updateEditorStatus: Function;
}
interface MainState {
    line: Line;
}

export default class Main extends Component<MainProps, MainState> {
    private main: RefObject<HTMLElement> = React.createRef();

    private mainDialog: RefObject<MainDialog> = React.createRef();

    public constructor(props: MainProps) {
        super(props);

        this.state = {
            line: {
                show: false,
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            },
        };

        // 绑定函数
        this.resetMainPosition = this.resetMainPosition.bind(this);
        this.updateLineStatus = this.updateLineStatus.bind(this);
        this.updateDialogStatus = this.updateDialogStatus.bind(this);

        this.handleInnerEvent = this.handleInnerEvent.bind(this);
        this.handleUpdateEvent = this.handleUpdateEvent.bind(this);
    }

    public componentDidMount(): void {
        this.resetMainPosition();
    }

    public render(): ReactNode {
        const {
            line,
        } = this.state;
        const {
            rate,
            items,
            loading,
            updateEditorStatus,
        } = this.props;

        return (
            <section ref={ this.main } className="tangram-main">
                <div className={ ['tangram-main-author', items.length ? '' : 'hide'].join(' ') }>
                    <i className='fas fa-pen'></i><span
                        onClick={ (): void => this.handleUpdateEvent() }
                        className='update'
                    >更新</span>
                </div>
                <div
                    className="tangram-main-inner"
                    onClick={ (): void => this.handleInnerEvent() }
                >
                    <div
                        style={ {
                            transform: `scale(${rate / 100})`,
                        } }
                        id="tangram-page"
                        className="tangram-main-page"
                    >
                        <img src={ TopBar } className="tangram-main-top-bar" />
                        <div id="tangram-demo" className="tangram-main-demo"></div>
                        <MainLine data={ line } />
                        <div className="tangram-main-operate">
                            {
                                items.map((item): ReactNode => {
                                    const {
                                        id,
                                    } = item;

                                    return (
                                        <MainItem
                                            key={ id }
                                            data={ item }
                                            updateEditorStatus={ updateEditorStatus }
                                            updateLineStatus={ this.updateLineStatus }
                                            updateDialogStatus={ this.updateDialogStatus }
                                        />
                                    );
                                })
                            }
                        </div>
                        <div className={ ['tangram-main-loading', loading ? '' : 'hide'].join(' ') }>
                            <Loading
                                type={ 'big' }
                                loading={ loading }
                            />
                        </div>
                    </div>
                </div>
                <MainDialog
                    ref={ this.mainDialog }
                    updateEditorStatus={ updateEditorStatus }
                />
            </section>
        );
    }

    // --------------------页面更新函数--------------------
    /**
     * 重置demo的位置
     */
    public resetMainPosition(): void {
        const {
            main,
        } = this;

        // 获取相关参数
        const left = (8710 - $(main.current).width()) / 2;
        const top = 8710 / 2 - 60 + $('#tangram-page').height() / 4;

        // 执行滚动
        main.current.scrollTo(left, top);
    }

    /**
     * 更新Line的状态
     * @param source [待更新的Line数据]
     */
    private updateLineStatus(source: Line): void {
        this.setState({
            line: source,
        });
    }

    /**
     * 更新选择弹框状态
     * @param item [选中的item对象数据]
     */
    private updateDialogStatus(item: Item): boolean {
        const {
            top,
            left,
            width,
            height,
        } = item;
        const {
            overlap,
        } = this.props;

        const key = `${top}-${left}-${width}-${height}`;

        // 如果只有一个则直接更新编辑面板
        if (overlap[key].length === 1) {
            return true;
        }
        // 引导用户选择编辑项目
        this.mainDialog.current.show(overlap[key]);
        return false;
    }

    // --------------------事件处理函数--------------------
    /**
     * 处理其他区域的点击事件
     */
    private handleInnerEvent(): void {
        const {
            updateEditorStatus,
        } = this.props;

        // 直接移除所有的选中状态
        $('.tangram-main-item').removeClass('selected');
        // 隐藏编辑面板
        updateEditorStatus(false);
    }

    /**
     * 更新按钮点击事件
     */
    private handleUpdateEvent(): void {
        const {
            id,
        } = this.props;

        // 跳转编辑页面
        id > 0 && window.open(`${JUMP_LINK.increase}?id=${id}`);
    }
}
