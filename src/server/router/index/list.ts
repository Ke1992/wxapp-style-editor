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
export default function list(ctx: Context): Data {
    const {
        category,
    } = ctx.request.query;

    // 获取转换后的demo数据
    const result = indexDao.list(category);
    // 返回结果
    return new Data(0, result, '查询成功');
}
