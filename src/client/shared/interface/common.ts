// 分类数据对象
export interface CategoryData {
    key: string;
    text: string;
}

// 后台接口返回的响应数据
export interface ResponseData {
    // 返回的消息
    message: string;

    // 返回码
    errorCode: number;

    // 返回的具体数据
    data: object | string | number | boolean | object[] | string[] | number[];
}
