// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import EditorItem from './EditorItem';
// 基础定义
import {
    CssSource,
} from '../../../shared/interface';
// 样式
require('./Editor.scss');
// 定义
interface EditorProps {
    show: boolean;
    list: CssSource[];
    updateCssModel: Function;
}

export default class Editor extends Component<EditorProps, {}> {
    private items: EditorItem[];

    public constructor(props: EditorProps) {
        super(props);

        // 绑定函数
        this.handleApplyEvent = this.handleApplyEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            show,
            list,
        } = this.props;
        // 重置数组
        this.items = [];

        return (
            <section className={['tangram-editor', show ? 'show' : ''].join(' ')}>
                <div className="tangram-editor-title">
                    <span>样式列表</span>
                </div>
                <ul>
                    {
                        list.map((item, index): ReactNode => {
                            const {
                                source,
                                selector,
                            } = item;

                            return (
                                <EditorItem
                                    ref={ (child): number => child && this.items.push(child) }
                                    key={ `${selector}_${index}` }
                                    source={ source }
                                    selector={ selector }
                                />
                            );
                        })
                    }
                </ul>
                <div className="tangram-editor-btns">
                    <div
                        className="tangram-editor-btns-apply"
                        onClick={ (): void => this.handleApplyEvent() }
                    >
                        <i className="fas fa-pencil-alt"></i>应用
                    </div>
                </div>
            </section>
        );
    }

    // --------------------事件处理函数--------------------
    /**
     * 应用点击事件
     */
    private handleApplyEvent(): void {
        const data: CssSource[] = [];

        // 遍历获取数据
        this.items.forEach((item): void => {
            data.push(item.getValue());
        });

        // 更新demo的css模型数据
        this.props.updateCssModel(data);
    }
}
