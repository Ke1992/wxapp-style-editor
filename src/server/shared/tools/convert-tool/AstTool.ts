// 库
import {
    SourceMapConsumer,
} from 'source-map';
import * as _ from 'lodash';
import * as postcss from 'postcss';
// 自己的库
import SassTool from './SassTool';
// 定义
import {
    CssModel,
    SourceMapData,
} from '../../interface';

/**
 * ast工具类
 */
// TODO: 现在没有考虑sass变量的语法，函数就直接不支持了
// TODO: 不支持sass的嵌套属性，参考文档: http://sass.bootcss.com/docs/sass-reference/
export default class AstTool {
    /**
     * 根据单位转换sass源码
     * @param sass [待格式化的sass源码]
     * @param unit [需要转换的单位: px、rem]
     */
    public static async convertSassByUnit(sass: string, unit: string): Promise<string> {
        // 先格式化一次，再解析成ast树
        const ast = postcss.parse(await SassTool.formatSass(sass));
        // 遍历所有的规则，替换单位，替换标签key
        ast.walkRules((item): void => {
            const rule = item; // 当前规则对象
            const selectors: string[] = []; // 获取所有选择器
            // 遍历替换小程序标签为H5标签
            rule.selectors.forEach((selector): void => {
                const items: string[] = [];

                // 拆分遍历
                selector.split(' ').forEach((ceil): void => {
                    // 选择器参考文档: https://www.w3school.com.cn/cssref/css_selectors.asp
                    // 是类选择器，则直接添加结果
                    if (ceil[0] === '.' || ceil[0] === '&') {
                        // 这里原本需要考虑 > 和 + 选择器的场景，这里提前使用SassTool.formatSass格式化来规避
                        items.push(ceil);
                        return;
                    }
                    // 拆分选择器，范例: .list .item view::after
                    const elements = ceil.split(':');
                    // 拆分标签，范例: .list .item text.amount
                    const tags = elements[0].split('.');
                    // 判断标签是否需要替换，其中scroll-view的scroll-y和scroll-x属性在client侧进行解决
                    if (tags[0] === 'view' || tags[0] === 'scroll-view') {
                        tags[0] = 'div';
                    } else if (tags[0] === 'text') {
                        tags[0] = 'span';
                    } else if (tags[0] === 'image') {
                        tags[0] = 'img';
                    }
                    // 添加结果
                    items.push([tags.join('.'), ...elements.splice(1)].join(':'));
                });

                // 重置选择器
                selectors.push(items.join(' '));
            });
            // 重置规则的选择器
            rule.selectors = selectors;

            // 将rpx转换成对应单位
            rule.replaceValues(/\d+rpx/g, {
                fast: 'rpx',
            }, (content): string => {
                // 获取具体数值
                const value = parseInt(content, 10);
                // 两像素以下，不需要单位转换
                if (value <= 2) {
                    return `${value}px`;
                }
                // 返回对应单位
                if (unit === 'px') {
                    return `${value}px`;
                }
                return `${value / 2 / 20}rem`;
            });

            // 针对导出H5的场景，移除图片的协议头
            if (unit === 'rem') {
                rule.replaceValues('http://', {
                    fast: 'http://',
                }, (): string => '//');
                rule.replaceValues('https://', {
                    fast: 'https://',
                }, (): string => '//');
            }
        });
        // 遍历所有的@规则，移除协议头
        unit === 'rem' && ast.walkAtRules((rule): void => {
            rule.replaceValues('http://', {
                fast: 'http://',
            }, (): string => '//');
            rule.replaceValues('https://', {
                fast: 'https://',
            }, (): string => '//');
        });
        // 返回最终结果
        return ast.toString();
    }

    /**
     * 将css转换成数据模型
     * @param source [待转换的css源码]
     */
    public static convertCssToModel(source: string): CssModel {
        const model: CssModel = {};
        // 将css转换成ast树
        const ast = postcss.parse(source);
        // 处理atRule
        AstTool.handleAtRule(ast, model);
        // 处理普通的Rule
        AstTool.handleRule(ast, model);
        // 返回对象
        return model;
    }

    /**
     * 更新Sass源码
     * @param model [需要更新的样式数据对象]
     * @param sass  [原始Sass代码]
     */
    public static async updateSassFromCss(model: CssModel, sass: string): Promise<string> {
        // 获取源码line为key的最新样式数据
        const original = await AstTool.getOriginalData(model, sass);
        // 生成ast树
        const ast = postcss.parse(sass);
        // 如果需要更新
        if (!_.isEmpty(original)) {
            // 更新普通规则
            AstTool.updateAstRule(ast, original);
            // 更新@规则
            AstTool.updateAstAtRule(ast, original);
        }
        // 重新转换成sass源码（使用stylefmt进行格式化）
        const result = await SassTool.formatSass(ast.toString());

        // 返回结果
        return result;
    }

    // -----------------------------私有函数-----------------------------

    /**
     * 处理atRule（暂时主要是keyframes）
     * @param ast   [对应样式的ast树]
     * @param model [css数据模型]
     */
    private static handleAtRule(ast: postcss.Root, model: CssModel): void {
        const result = model;
        // 遍历处理keyframes
        ast.walkAtRules(/keyframes/, (rule): void => {
            const key = `@${rule.name} ${rule.params}`;
            const css = rule.nodes.join(`${rule.raws.after}`);
            const {
                source: {
                    start: {
                        line, // 规则对应的行数
                    },
                },
            } = rule;

            // 生成结果
            result[key] = {
                css, // 自身的css样式
                line, // 规则对应的行数
                selectors: [], // 所有的选择器
                isModified: false, // 是否修改过
            };
        });
        // 遍历处理字体
        ast.walkAtRules(/font-face/, (rule): void => {
            let name = '';
            rule.walkDecls((decl): void => {
                if (decl.prop === 'font-family') {
                    name = decl.value.replace(/"|'/g, '');
                }
            });
            // 如果没有找到字体定义，则直接返回
            if (_.isEmpty(name)) {
                return;
            }
            // 生成必要的参数
            const key = `@${rule.name}___${name}`;
            const css = `${rule.nodes.join(`;${rule.raws.after}`)};`;
            const {
                source: {
                    start: {
                        line, // 规则对应的行数
                    },
                },
            } = rule;

            // 生成结果
            result[key] = {
                css, // 自身的css样式
                line, // 规则对应的行数
                selectors: [], // 所有的选择器
                isModified: false, // 是否修改过
            };
        });
    }

    /**
     * 处理普通的rule
     * @param ast   [对应样式的ast树]
     * @param model [css数据模型]
     */
    private static handleRule(ast: postcss.Root, model: CssModel): void {
        const result = model;
        // 遍历规则，提取选择器
        ast.nodes.forEach((rule): void => {
            // 如果当前节点不是rule，则直接返回
            if (rule.type !== 'rule') {
                return;
            }
            const {
                source: {
                    start: {
                        line, // 规则对应的行数
                    },
                },
                selector,
                selectors,
            } = rule;
            const css = `${rule.nodes.join(`;${rule.raws.after}`)};`;

            // 遍历animation相关
            rule.walkDecls(/animation/, (decl): void => {
                const key = `@${decl.prop.split('animation')[0]}keyframes ${decl.value.split(' ')[0]}`;
                // 存在对应的keyframes，则修改selectors
                result[key] && result[key].selectors.push(...selectors);
            });

            // 遍历字体相关
            rule.walkDecls(/font-family/, (decl): void => {
                decl.value.split(',').some((item): boolean => {
                    const name = item.trim().replace(/"|'/g, '');
                    const key = `@font-face___${name}`;
                    // 存在对应的字体申明，则修改selectors
                    if (result[key]) {
                        result[key].selectors.push(...selectors);
                        return true;
                    }
                    return false;
                });
            });

            // 生成结果
            result[selector] = {
                css, // 自身的css样式
                line, // 规则对应的行数
                selectors, // 所有的选择器
                isModified: false, // 是否修改过
            };
        });
    }

    /**
     * 获取源码line为key的最新样式数据
     * @param model [需要更新的样式数据对象]
     * @param sass  [原始Sass代码]
     */
    private static async getOriginalData(model: CssModel, sass: string): Promise<SourceMapData> {
        const original: SourceMapData = {};
        const generated: SourceMapData = {};

        // 没有待更新的样式，直接返回
        if (_.isEmpty(model)) {
            return original;
        }

        // 遍历获取source-map匹配用的数据
        _.forEach(model, (value): void => {
            generated[`line_${value.line}`] = value.css;
        });

        // 获取source-map
        const {
            map,
        } = SassTool.convertSassToCss(await AstTool.convertSassByUnit(sass, 'px'));
        // 包一层Promise，方便阅读/维护
        await new Promise((resolve): void => {
            // 解析source-map
            SourceMapConsumer.with(map, null, (consumer): void => {
                // 遍历source-map，找到对应的原始行数
                consumer.eachMapping((item): void => {
                    const {
                        originalLine, // 源码中的line数据
                        generatedLine, // 生成代码中的line数据
                    } = item;

                    const data = generated[`line_${generatedLine}`];
                    // 如果匹配到了数据
                    if (!_.isEmpty(data)) {
                        // 以源码line为key，最新的样式数据为value
                        original[`line_${originalLine}`] = data;
                    }
                });
                // 遍历完成，结束掉Promise
                resolve();
            });
        });

        return original;
    }

    /**
     * 更新普通规则
     * @param ast      [样式对应的ast树]
     * @param original [key为源码line的最新css样式数据对象]
     */
    private static updateAstRule(ast: postcss.Root, original: SourceMapData): void {
        // 遍历更新规则
        ast.walkRules((rule): void => {
            AstTool.updateRuleNode('rule', rule, original);
        });
    }

    /**
     * 更新@规则
     * @param ast      [样式对应的ast树]
     * @param original [key为源码line的最新css样式数据对象]
     */
    private static updateAstAtRule(ast: postcss.Root, original: SourceMapData): void {
        // 这里不适用关键字进行过滤，方便后面扩展
        ast.walkAtRules((rule): void => {
            AstTool.updateRuleNode('atrule', rule, original);
        });
    }

    /**
     * 更新样式对象的node属性
     * @param rule     [当前样式对象]
     * @param original [key为源码line的最新css样式数据对象]
     */
    private static updateRuleNode(
        type: string,
        rule: postcss.Rule | postcss.AtRule,
        original: SourceMapData,
    ): void {
        const currentRule = rule;
        // 获取规则对应的行数
        const {
            source: {
                start: {
                    line,
                },
            },
        } = currentRule;

        // 获取待更新的数据
        const data = original[`line_${line}`];
        // 如果不存在，则直接忽略
        if (_.isEmpty(data)) {
            return;
        }
        // 获取更新后的样式规则
        const nodes: postcss.ChildNode[] = AstTool.getUpdatedSassNodes(data);

        // 遍历添加其他定义
        type === 'rule' && currentRule.nodes.forEach((node): void => {
            node.type !== 'decl' && nodes.push(node);
        });

        // 更新规则
        currentRule.nodes = nodes;
    }

    /**
     * 获取更新后的Sass代码节点
     * @param css [待更新的css代码]
     */
    private static getUpdatedSassNodes(css: string): postcss.ChildNode[] {
        // 生成ast树
        const ast = postcss.parse(`{${css}}`);
        // 遍历规则转换单位
        ast.walkRules((rule): void => {
            rule.replaceValues(/\d+px/g, {
                fast: 'px',
            }, (content): string => {
                // 获取具体数值
                const value = parseInt(content, 10);
                // 返回px单位
                return `${value}rpx`;
            });
        });
        // 返回节点
        return [...(ast.first as postcss.Rule).nodes];
    }
}
