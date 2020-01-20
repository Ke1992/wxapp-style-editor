// 定义
import {
    CssModel,
} from './base';

// demo列表单项数据
export interface DemoListItem {
    id: number;
    name: string;
    cover: string;
}

// demo查询出来的详情数据
export interface DemoDetailData {
    css: string; // demo的css代码
    html: string; // demo的html代码
    extraCss: string; // 用来控制demo背景的额外css
    cssModel: CssModel; // demo的css数据模型对象
}
