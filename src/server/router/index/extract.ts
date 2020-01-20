// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';
import ConvertTool from '../../shared/tools/convert-tool';
// dao
import * as indexDao from '../../dao/index';
// 定义
import {
    CssModel,
} from '../../shared/interface';

/**
 * 详情接口
 * @param ctx [koa的Context对象]
 */
export default async function extract(ctx: Context): Promise<Data> {
    const {
        id,
        type,
    } = ctx.request.query;
    const model = ctx.request.body as CssModel;
    // 获取原始的demo数据
    const {
        wxml,
        sass,
    } = indexDao.detail(Number(id));

    // 获取结果
    const result = await ConvertTool.extractSource(model, sass, wxml, type);

    // 返回结果
    return new Data(0, result, '导出成功');
}
