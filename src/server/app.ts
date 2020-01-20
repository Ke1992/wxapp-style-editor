// 库
import * as Koa from 'koa';
import * as path from 'path';
import * as KoaStatic from 'koa-static';
import * as KoaBodyParser from 'koa-bodyparser';
// 自己的库
import UrlTool from './shared/tools/UrlTool';
import CustomError from './shared/classes/error/CustomError';
// 常量
import {
    PORT,
} from './shared/config/system-config';
// 全局变量
const app = new Koa();

// favicon.ico/异常 中间件
app.use(async (ctx, next): Promise<void> => {
    if (ctx.url === '/favicon.ico') {
        // 加载对应模块实例
        const moduleInstance = await import('./router/index');
        // 执行对应的方法
        moduleInstance.favicon(ctx);
        // 直接返回
        return;
    }
    try {
        // 执行下一个中间件
        await next();
    } catch (error) {
        const {
            message,
            errorCode,
        } = error;
        // 返回异常
        ctx.body = new CustomError(errorCode, message);
        // 通知一下onerror监听者，方便错误记录
        ctx.app.emit('error', error, ctx);
    }
});

// 静态资源 中间件
app.use(KoaStatic(path.join(__dirname, '/public')));

// 解析post数据
app.use(KoaBodyParser({
    jsonLimit: '5MB',
}));

// 正常路由 中间件
app.use(async (ctx): Promise<void> => {
    // 获取必要参数
    const {
        modulePath,
        methodName,
    } = UrlTool.getModuleAndMethod(ctx.path);
    // 加载对应的模块实例
    const moduleInstance = await import(modulePath);
    // 执行对应方法
    ctx.body = await moduleInstance[methodName](ctx);
});

// 异常捕获
app.on('error', async (error: Error, ctx: Koa.Context): Promise<void> => {
    // 输出异常信息
    console.error(
        '异常捕获:\r\n',
        `url: ${ctx.href}\r\n`,
        '异常信息:\r\n',
        error,
    );
});

// 监听端口
app.listen(PORT);
