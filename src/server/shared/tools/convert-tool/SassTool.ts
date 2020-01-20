// 库
import * as sass from 'sass';
import * as postcss from 'postcss';
import * as stylefmt from 'stylefmt';
import * as scss from 'postcss-scss';
// 定义
import {
    CssResult,
} from '../../interface';

/**
 * Sass工具类
 */
export default class SassTool {
    /**
     * 将sass转换成css
     * @param source [待转换的sass源码]
     */
    public static convertSassToCss(source: string): CssResult {
        // 将sass转换成css
        const result = sass.renderSync({
            data: source, // 待转换的sass源码

            indentWidth: 4,
            indentType: 'space',

            outputStyle: 'expanded', // 指定输出格式

            sourceMap: 'out.map',
            omitSourceMapUrl: true, // 表示css中不会生成map映射关系
            sourceMapContents: true, // 表示map中是否直接带上content内容
        });

        // 返回对应结果
        return {
            css: result.css.toString(),
            map: result.map.toString(),
        };
    }

    /**
     * 重新转换成sass源码（使用stylefmt进行格式化）
     * @param source [待格式化的源码]
     */
    public static async formatSass(source: string, type = 'sass'): Promise<string> {
        // 参数
        const options: postcss.ProcessOptions = {
            from: undefined,
        };

        if (type === 'sass') {
            options.syntax = scss;
        }

        // 进行格式化
        const result = await postcss([
            stylefmt({
                rules: {
                    // 配置4个空格作为缩进
                    indentation: 4,
                },
            }),
        ]).process(source, options).then(({ css }): string => css);

        // 返回结果
        return result;
    }
}
