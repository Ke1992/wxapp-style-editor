// 库
import {
    Context,
} from 'koa';
import * as _ from 'lodash';
import * as http from 'http';
// 自己的库
import UrlTool from './UrlTool';
import Data from '../classes/base/Data';
import CustomError from '../classes/error/CustomError';
// 定义
interface RequestParam {
    url: string;
    data: object;
}

/**
 * http请求工具类
 */
export default class HttpTool {
    /**
     * 发起本地的get请求
     * @param param [请求的必要参数]
     * @param ctx   [koa的Context对象]
     */
    public static async get(ctx: Context, param: RequestParam): Promise<Data> {
        // 获取请求必要的参数
        const {
            options,
        } = HttpTool.formatOptions(ctx, 'get', param);
        // 发起请求
        return HttpTool.request(options);
    }

    /**
     * 发起本地的post请求
     * @param param [请求的必要参数]
     * @param ctx   [koa的Context对象]
     */
    public static async post(ctx: Context, param: RequestParam): Promise<Data> {
        // 获取请求必要的参数
        const {
            options,
            postData,
        } = HttpTool.formatOptions(ctx, 'post', param);
        // 发起请求
        return HttpTool.request(options, postData);
    }

    /**
     * 底层请求函数
     * @param options [请求所需要的参数]
     */
    private static async request(
        options: http.RequestOptions,
        postData: string = null,
    ): Promise<Data> {
        // 返回结果
        return new Promise((resolve, reject): void => {
            // 构造请求
            const req = http.request(options, (res): void => {
                let content = '';

                res.setEncoding('utf8');
                res.on('data', (chunk): void => {
                    content += chunk.toString();
                });

                res.on('end', (): void => {
                    // 判断接口状态码
                    if (res.statusCode === 200) {
                        resolve(new Data(0, content, '请求成功'));
                        return;
                    }
                    // 抛出错误
                    reject(new CustomError(CustomError.LOCAL_HTTP_ERROR, '本地http请求返回状态码非200'));
                });
            });

            // 监听异常
            req.on('error', (error): void => {
                // 抛出错误
                reject(new CustomError(CustomError.LOCAL_HTTP_ERROR, error.message));
            });

            // POST请求需要写数据
            !_.isNull(postData) && req.write(postData);

            // 发起请求
            req.end();
        });
    }

    /**
     * 格式化请求链接
     * @param param [请求的必要参数]
     * @param ctx   [koa的Context对象]
     */
    private static formatOptions(ctx: Context, method: string, param: RequestParam): {
        postData: string;
        options: http.RequestOptions;
    } {
        let postData = '';
        const {
            url,
            data,
        } = param;

        const headers: http.OutgoingHttpHeaders = {
            referer: ctx.href,
            cookie: ctx.header.cookie,
        };

        // 如果是post请求需要特殊处理
        if (method === 'post') {
            // 遍历拼接post数据
            _.forEach(data, (value, key): void => {
                if (!_.isArray(value) && _.isObject(value)) {
                    postData += `${key}=${encodeURIComponent(JSON.stringify(value))}&`;
                } else {
                    postData += `${key}=${encodeURIComponent(value)}&`;
                }
            });
            postData = postData.slice(0, -1);

            // 设置额外的头部信息
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            headers['Content-Length'] = Buffer.byteLength(postData);
        }

        return {
            postData,
            options: {
                method,
                headers,
                port: 80,
                ...UrlTool.formatUrl(url, method === 'post' ? {} : data),
            },
        };
    }
}
