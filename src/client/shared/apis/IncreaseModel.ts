// 库
import Request from '../tools/Request';
// 定义
import {
    MockData,
    ResponseData,
    IncreaseData,
} from '../interface';
// 配置
import {
    PREFIX,
} from '../config/base-config';

/**
 * index数据请求类
 */
export default class IncreaseModel {
    /**
     * 获取预览数据
     * @param data [预览所需要的mock数据]
     */
    public static async preview(data: MockData): Promise<ResponseData> {
        // 发起请求
        return Request.post(`${PREFIX}/increase/preview`, data)
            .then((result): ResponseData => result);
    }

    /**
     * 保存新的ui
     * @param data [到保存的数据]
     */
    public static async save(data: IncreaseData): Promise<ResponseData> {
        // 发起请求
        return Request.post(`${PREFIX}/increase/save`, data)
            .then((result): ResponseData => result);
    }

    /**
     * 根据id查询demo的详情数据
     * @param id [demo的id值]
     */
    public static async detail(id: string): Promise<ResponseData> {
        // 发起请求
        return Request.get(`${PREFIX}/increase/detail`, { id })
            .then((result): ResponseData => result);
    }

    /**
     * 更新操作
     * @param id   [对应的id值]
     * @param data [待更新的数据]
     */
    public static async update(id: string, data: IncreaseData): Promise<ResponseData> {
        // 发起请求
        return Request.post(`${PREFIX}/increase/update?id=${id}`, data)
            .then((result): ResponseData => result);
    }
}
