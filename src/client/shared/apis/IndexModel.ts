// 库
import Request from '../tools/Request';
// 定义
import {
    CssModel,
    ResponseData,
} from '../interface';
// 配置
import {
    PREFIX,
} from '../config/base-config';

/**
 * index数据请求类
 */
export default class IndexModel {
    /**
     * 根据category值获取demo列表
     * @param category [筛选类型]
     */
    public static async list(category = 'all'): Promise<ResponseData> {
        // 发起请求
        return Request.get(`${PREFIX}/index/list`, { category })
            .then((result): ResponseData => result);
    }

    /**
     * 获取demo的相关初始化数据
     * @param id [demo对应的id]
     */
    public static async detail(id: number): Promise<ResponseData> {
        // 发起请求
        return Request.get(`${PREFIX}/index/detail`, { id })
            .then((result): ResponseData => result);
    }

    /**
     * 导出样式代码
     * @param id    [demo对应的ID]
     * @param type  [导出类型: miniprograms、mobile]
     * @param model [css的数据模型]
     */
    public static async extract(id: number, type: string, model: CssModel): Promise<ResponseData> {
        return Request.post(`${PREFIX}/index/extract?id=${id}&type=${type}`, model)
            .then((result): ResponseData => result);
    }

    /**
     * 获取类别数据
     */
    public static async category(): Promise<ResponseData> {
        // 发起请求
        return Request.get(`${PREFIX}/index/category`)
            .then((result): ResponseData => result);
    }
}
