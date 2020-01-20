// 库
import {
    Context,
} from 'koa';
import * as fs from 'fs';
import * as path from 'path';
// 常量
const FAVICON_ICON_PATH = path.resolve(__dirname, '../../favicon.ico');
const FAVICON_ICON_CONTENT = fs.readFileSync(FAVICON_ICON_PATH);

/**
 * favicon.ico
 * @param ctx [koa的Context对象]
 */
export default function favicon(ctx: Context): void {
    ctx.type = 'image/x-icon';
    ctx.body = FAVICON_ICON_CONTENT;
    ctx.set('Cache-Control', `public, max-age=${86400000 / 1000}`);
}
