// 库
import * as path from 'path';

// 端口
export const PORT = 8848;
// mock数据的地址
export const MOCK_FILE_PATH = path.resolve(__dirname, '../../mock/index.js');
// 当前是否是开发环境
export const IS_DEV_ENV = process.env.NODE_ENV === 'development';
