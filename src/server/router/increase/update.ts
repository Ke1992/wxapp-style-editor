// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';
import ConvertTool from '../../shared/tools/convert-tool';
// Dao
import * as indexDao from '../../dao/index';
// 定义
import {
    IncreaseData,
} from '../../shared/interface';

/**
 * 保存接口
 * @param ctx [koa的Context对象]
 */
export default async function update(ctx: Context): Promise<Data> {
    // 获取相关数据
    const {
        id,
    } = ctx.request.query;
    const data = ctx.request.body as IncreaseData;

    // 校验数据合法性
    await ConvertTool.getDemoData(data.wxml, data.sass, data.extraSass);
    // 录入UI
    indexDao.update(Number(id), data);

    // 返回结果
    return new Data(0, id, '更新成功');
}
