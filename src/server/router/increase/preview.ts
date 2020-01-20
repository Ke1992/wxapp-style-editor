// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';
import ConvertTool from '../../shared/tools/convert-tool';
// 定义
import {
    MockData,
} from '../../shared/interface';

/**
 * 详情接口
 * @param ctx [koa的Context对象]
 */
export default async function preview(ctx: Context): Promise<Data> {
    // 获取相关数据
    const {
        wxml,
        sass,
        extraSass,
    } = ctx.request.body as MockData;

    // 获取转换后的demo数据
    const result = await ConvertTool.getDemoData(wxml, sass, extraSass);
    // 返回结果
    return new Data(0, {
        ...result,
    }, '查询成功');
}
