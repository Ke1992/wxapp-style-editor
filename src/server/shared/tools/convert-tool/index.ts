// 自己的库
import AstTool from './AstTool';
import SassTool from './SassTool';
import HtmlTool from './HtmlTool';
// 定义
import {
    DemoData,
    CssModel,
    ExtractResult,
} from '../../interface';

/**
 * 转换工具类
 */
export default class ConvertTool {
    /**
     * 将源码转换成demo数据对象
     * @param wxml      [wxml源码]
     * @param sass      [sass源码]
     * @param extraSass [额外sass源码]
     */
    public static async getDemoData(
        wxml: string, sass: string, extraSass: string,
    ): Promise<DemoData> {
        // 获取demo的css样式
        const {
            css,
        } = SassTool.convertSassToCss(await AstTool.convertSassByUnit(sass, 'px'));
        // 获取demo的额外样式
        const {
            css: extraCss,
        } = SassTool.convertSassToCss(await AstTool.convertSassByUnit(extraSass, 'px'));
        // 获取demo的html代码
        const html = HtmlTool.convertWxmlToHtml(wxml);
        // 获取demo的css数据模型
        const cssModel = AstTool.convertCssToModel(css);

        return {
            css,
            html,
            extraCss,
            cssModel,
        };
    }

    /**
     * 导出样式源码
     * @param model [待更新的样式模型数据]
     * @param sass  [sass源码]
     * @param wxml  [wxml源码]
     * @param type  [导出类型: miniprograms、mobile]
     */
    public static async extractSource(
        model: CssModel, sass: string, wxml: string, type: string,
    ): Promise<ExtractResult> {
        // 根据类型对sass源码进行转换
        const source = type === 'miniprograms' ? await SassTool.formatSass(sass) : await AstTool.convertSassByUnit(sass, 'rem');
        // 获取更新后的sass源码
        const result: ExtractResult = {
            css: '',
            wxml: '',
            html: '',
            sass: await AstTool.updateSassFromCss(model, source),
        };
        // 更新Css源码，sass不支持通过参数去掉@charset，因此手动去掉，生成逻辑参考sass源码6571行
        result.css = SassTool.convertSassToCss(result.sass).css.toString().replace('@charset "UTF-8";\n', '');
        // 格式化Css
        result.css = await SassTool.formatSass(result.css, 'css');
        // 如果是小程序，则更新wxml
        if (type === 'miniprograms') {
            result.wxml = wxml;
        } else {
            result.html = HtmlTool.convertWxmlToHtml(wxml);
        }
        // 返回结果
        return result;
    }
}
