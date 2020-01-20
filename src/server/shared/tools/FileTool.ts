// 库
import * as fs from 'fs';
// 常量
import {
    MOCK_FILE_PATH,
} from '../config/system-config';

/**
 * 文件工具类
 */
export default class FileTool {
    /**
     * 更新mock的数据文件
     */
    public static updateMockData(data: object): void {
        // 更新数据
        fs.writeFileSync(MOCK_FILE_PATH, `module.exports = ${JSON.stringify(data, null, '    ')}`);
    }
}
