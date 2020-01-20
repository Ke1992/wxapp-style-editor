// 定义
import {
    ExtractResult,
} from '../interface';

/**
 * ScrollView工具类
 */
export default class ScrollViewTool {
    /**
     * 特殊处理预览中的scroll-view
     */
    public static handlePreview(): void {
        // 遍历处理
        $('div[is-scroll-view]').each(function scrollViewEvent(): void {
            // 添加必要样式
            $(this).attr('scroll-x') === 'true' && $(this).css('overflow-x', 'auto');
            $(this).attr('scroll-y') === 'true' && $(this).css('overflow-y', 'auto');

            // 移除属性
            $(this).removeAttr('is-scroll-view').removeAttr('scroll-x').removeAttr('scroll-y');
        });
    }

    /**
     * 特殊处理导出中的scroll-view
     */
    public static handleExtract(type: string, data: ExtractResult): ExtractResult {
        const result = data;

        // 如果是H5导出，才进行特殊处理
        if (type === 'mobile') {
            const container = $(`<div>${data.html}</div>`);

            container.find('div[is-scroll-view]').each(function scrollViewEvent(): void {
                // 添加必要样式
                $(this).attr('scroll-x') === 'true' && $(this).css('overflow-x', 'auto');
                $(this).attr('scroll-y') === 'true' && $(this).css('overflow-y', 'auto');

                // 移除属性
                $(this).removeAttr('is-scroll-view').removeAttr('scroll-x').removeAttr('scroll-y');
            });

            // 更新html
            result.html = container.html();
        }

        return result;
    }
}
