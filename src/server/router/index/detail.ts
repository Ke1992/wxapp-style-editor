// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';
import ConvertTool from '../../shared/tools/convert-tool';
// Dao
import * as indexDao from '../../dao/index';

/**
 * 详情接口
 * @param ctx [koa的Context对象]
 */
export default async function detail(ctx: Context): Promise<Data> {
    const {
        id,
    } = ctx.request.query;
    // 获取原始的demo数据
    const {
        wxml,
        sass,
        extraSass,
    } = indexDao.detail(Number(id));

    // 获取转换后的demo数据
    const result = await ConvertTool.getDemoData(wxml, sass, extraSass);
    // 返回结果
    return new Data(0, {
        ...result,
    }, '查询成功');
}
