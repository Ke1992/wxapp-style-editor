// 自己的库
import Data from '../../shared/classes/base/Data';
// Dao
import * as indexDao from '../../dao/index';

/**
 * 详情接口
 */
export default function category(): Data {
    // 获取原始的demo数据
    const result = indexDao.category();

    // 返回结果
    return new Data(0, result, '查询成功');
}
