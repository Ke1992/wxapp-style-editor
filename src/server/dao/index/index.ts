// 库
import * as _ from 'lodash';
// 自己的库
import FileTool from '../../shared/tools/FileTool';
import CustomError from '../../shared/classes/error/CustomError';
// 定义
import {
    MockData,
    MockItemData,
    CategoryData,
    IncreaseData,
} from '../../shared/interface';
// 配置
import {
    MOCK_FILE_PATH,
} from '../../shared/config/system-config';
import CategoryConfig from '../../shared/config/category-config';
// TODO: 后续需要改成数据库存储
const data = require(MOCK_FILE_PATH); // eslint-disable-line

/**
 * 根据category获取对应的demo列表
 * @param param [类别]
 */
function list(param: string): MockItemData[] {
    const result: MockItemData[] = [];

    // 遍历添加数据
    data.forEach((item: MockData): void => {
        // 过滤类别
        if (item.category === param || param === 'all' || _.isEmpty(param)) {
            result.unshift({
                id: item.id,
                name: item.name,
                cover: item.cover,
            });
        }
    });

    return result;
}

/**
 * 录入新的UI
 * @param param [到保存的数据]
 */
function save(param: IncreaseData): number {
    const id = new Date().getTime();

    // 塞入数据
    data.push({
        id,
        ...param,
    });
    // 更新数据
    FileTool.updateMockData(data);

    return id;
}

/**
 * 根据id获取对应demo数据
 * @param id [demo对应的id]
 */
function detail(id: number): MockData {
    let result = null;

    // 遍历找到对应的demo
    data.some((item: MockData): boolean => {
        if (item.id === id) {
            result = item;
            return true;
        }
        return false;
    });

    // 没有找到数据
    if (_.isNull(result)) {
        throw new CustomError(CustomError.SYSTEM_ERROR, `id: ${id}，未找到数据`);
    }

    return result;
}

/**
 * 根据id更新UI数据
 * @param id    [对应的id值]
 * @param param [待更新的数据]
 */
function update(id: number, param: IncreaseData): void {
    // 遍历找到对应的demo
    data.some((ceil: MockData): boolean => {
        const item = ceil;
        // 更新配置
        if (item.id === id) {
            item.name = param.name;
            item.wxml = param.wxml;
            item.sass = param.sass;
            item.cover = param.cover;
            item.category = param.category;
            item.extraSass = param.extraSass;
            return true;
        }
        return false;
    });
    // 更新数据
    FileTool.updateMockData(data);
}

/**
 * 获取demo所有的分类
 */
function category(): CategoryData[] {
    return CategoryConfig;
}

export {
    list,
    save,
    update,
    detail,
    category,
};
