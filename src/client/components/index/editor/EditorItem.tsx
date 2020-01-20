// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
// 基础定义
import {
    CssSource,
    CssSource as EditorItemProps,
} from '../../../shared/interface';
// 样式
require('./EditorItem.scss');

export default class EditorItem extends Component<EditorItemProps, {}> {
    private li: RefObject<HTMLLIElement> = React.createRef();

    private declaration: RefObject<HTMLDivElement> = React.createRef();

    public constructor(props: EditorItemProps) {
        super(props);

        // 绑定函数
        this.handleClickEvent = this.handleClickEvent.bind(this);
    }

    public componentDidMount(): void {
        const {
            declaration,
        } = this;

        // 设置contenteditable属性，在JSX中直接赋值会产生error
        $(declaration.current).attr('contenteditable', 'plaintext-only');
    }

    public render(): ReactNode {
        const {
            source: {
                css,
                selectors,
            },
        } = this.props;

        return (
            <li
                ref={ this.li }
                onClick={ (): void => this.handleClickEvent() }
            >
                <div className="tangram-editor-tips" dangerouslySetInnerHTML={ { __html: selectors.join(',<br>') } }></div>
                <div className="tangram-editor-tips">{ '{' }</div>
                <div ref={ this.declaration } className="tangram-editor-declaration">{ css }</div>
                <div className="tangram-editor-tips">{ '}' }</div>
            </li>
        );
    }

    // --------------------数据相关函数--------------------
    /**
     * 获取编辑后的样式数据
     */
    public getValue(): CssSource {
        const {
            props: {
                source: {
                    selectors,
                },
                selector,
            },
            declaration,
        } = this;

        return {
            source: {
                selectors,
                css: $(declaration.current).text(),
            },
            selector,
        };
    }

    // --------------------事件处理函数--------------------
    /**
     * 鼠标点击事件
     */
    private handleClickEvent(): void {
        // 这里不直接使用event参数的原因: 因为eslint要求必须使用this，变相的规避eslint的error异常
        $(this.li.current).addClass('selected')
            // 兄弟节点移除选中态
            .siblings().removeClass('selected');
    }
}
