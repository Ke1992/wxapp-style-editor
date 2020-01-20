// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';
// Dao
import * as indexDao from '../../dao/index';

/**
 * 详情接口
 * @param ctx [koa的Context对象]
 */
export default function detail(ctx: Context): Data {
    // 获取相关数据
    const {
        id,
    } = ctx.request.query;

    // 获取原始的demo数据
    const data = indexDao.detail(Number(id));

    // 返回结果
    return new Data(0, data, '查询成功');
}
