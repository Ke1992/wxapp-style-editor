/**
 * HTML工具类
 */
export default class HtmlTool {
    /**
     * 将wxml转换成html代码
     * @param source [待格式化的wxml源码]
     */
    public static convertWxmlToHtml(source: string): string {
        // 转换代码
        const result = source
            // 替换view
            .replace(/<view /g, '<div ')
            .replace(/<view>/g, '<div>')
            .replace(/<\/view>/g, '</div>')
            // 替换text
            .replace(/<text /g, '<span ')
            .replace(/<text>/g, '<span>')
            .replace(/<\/text>/g, '</span>')
            // 替换image
            .replace(/<image /g, '<img ')
            .replace(/<\/image>/g, '')
            // 替换scroll-view
            .replace(/<scroll-view /g, '<div is-scroll-view ')
            .replace(/<scroll-view>/g, '<div>')
            .replace(/<\/scroll-view>/g, '</div>');

        // 返回
        return result;
    }
}
