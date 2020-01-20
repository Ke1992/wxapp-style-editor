// 库
import _ from 'lodash';
// 定义
import {
    CssModel,
    CssSource,
} from '../interface';
// 定义
interface Repeat {
    font: string[];
    animation: string[];
}

/**
 * CssModel辅助类
 */
export default class CssModelTool {
    /**
     * 获取当前选中的所有css样式
     * @param id    [当前选择的编辑对象映射ID]
     * @param model [demo的css数据模型对象]
     * @param index [当前递归的次数]
     */
    public static getCssFromModel(id: string, model: CssModel, index = 0): CssSource[] {
        // 结束递归
        if (index > 1) {
            return [];
        }

        const dom = $(`#${id}`)[0]; // 当前选择的dom
        const result: CssSource[] = [];
        const repeat: Repeat = {
            font: [],
            animation: [],
        };

        // 遍历获取所有样式
        _.forEach(model, (value, selector): void => {
            // 如果是@开头的，代表是animation或者font，直接跳过
            if (selector.slice(0, 1) === '@') {
                return;
            }
            // 获取对应的元素（包括伪元素样式定义）
            const items = Array.from($(selector.replace(/::before/g, '').replace(/:before/g, '').replace(/::after/g, '').replace(/:after/g, '')));
            // 如果包含当前选择的dom
            if (items.includes(dom)) {
                // 本身的定义
                result.push({
                    selector,
                    source: value,
                });
                // animation定义
                result.push(...CssModelTool.findAnimation(value.selectors, model, repeat));
                // 字体定义
                result.push(...CssModelTool.findFontFace(value.selectors, model, repeat));
            }
        });

        // 有找到对应的样式，则直接返回
        if (result.length) {
            return result;
        }

        // 没有找到进行一次递归
        const parentId = $(dom).parent().attr('id');
        // 返回递归的结果
        return CssModelTool.getCssFromModel(parentId, model, index + 1);
    }

    /**
     * 将修改的css样式更新到demo的model中
     * @param model  [demo的css数据模型对象]
     * @param source [待更新的css样式]
     */
    public static updateCssToModel(model: CssModel, source: CssSource[]): CssModel {
        const result = model;

        // 遍历更新css样式
        source.forEach((item): void => {
            const {
                source: {
                    css,
                },
                selector,
            } = item;

            result[selector].css = css;
            result[selector].isModified = true;
        });

        return result;
    }

    /**
     * 获取最新的demo样式
     * @param model [demo的css数据模型对象]
     */
    public static getStyleFromModel(model: CssModel): string {
        const styles: string[] = [];

        // 获取最新的所有样式
        _.forEach(model, (value, selector): void => {
            const {
                css,
            } = value;

            // 特殊处理字体定义
            if (selector.includes('@font-face')) {
                styles.push(`@font-face{${css}}`);
            } else {
                styles.push(`${selector}{${css}}`);
            }
        });

        return styles.join('');
    }

    // --------------------私有函数--------------------
    /**
     * 获取对应的动画定义
     * @param selectors [所有的选择器]
     * @param model     [demo的css数据模型对象]
     */
    private static findAnimation(
        selectors: string[], model: CssModel, repeat: Repeat,
    ): CssSource[] {
        const result: CssSource[] = [];

        // 遍历获取所有的伪元素样式
        _.forEach(model, (value, selector): void => {
            // 遍历对应的选择器
            selector.slice(0, 1) === '@' && selector.includes('keyframes') && value.selectors.some((item): boolean => {
                if (selectors.includes(item) && !repeat.animation.includes(selector)) {
                    // 添加防重复
                    repeat.animation.push(selector);
                    // 添加结果
                    result.push({
                        selector,
                        // 不使用原始数据，使用改造后的数据
                        source: {
                            css: value.css,
                            selectors: [selector],
                        },
                    });
                    return true;
                }
                return false;
            });
        });

        return result;
    }

    /**
     * 获取对应的字体定义
     * @param selectors [所有的选择器]
     * @param model     [demo的css数据模型对象]
     */
    private static findFontFace(selectors: string[], model: CssModel, repeat: Repeat): CssSource[] {
        const result: CssSource[] = [];

        // 遍历获取所有的伪元素样式
        _.forEach(model, (value, selector): void => {
            // 遍历对应的选择器
            selector.slice(0, 1) === '@' && selector.includes('font-face') && value.selectors.some((item): boolean => {
                if (selectors.includes(item) && !repeat.font.includes(selector)) {
                    // 添加防重复
                    repeat.font.push(selector);
                    // 添加结果
                    result.push({
                        selector,
                        // 不使用原始数据，使用改造后的数据
                        source: {
                            css: value.css,
                            selectors: ['@font-face'],
                        },
                    });
                    return true;
                }
                return false;
            });
        });

        return result;
    }
}
