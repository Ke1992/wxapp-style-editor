// 底层定义
interface PositionData {
    top: number;
    left: number;
    width: number;
    height: number;
}

// demo的css数据模型对象
export interface CssModel {
    [propName: string]: {
        css: string; // 自身的css样式
        line: number; // 规则对应的行数
        selectors: string[]; // 所有的选择器
        isModified: boolean; // 是否修改过
    };
}

// 从model里面找到的css结果
export interface CssSource {
    source: {
        css: string;
        selectors: string[]; // 所有选择器（已拆分）
    };
    selector: string; // 选择器（未拆分）
}

// Main组件里面的Item对象定义
export interface MainItem extends PositionData {
    id: string;
}

// Main组件里面的Line对象定义
export interface MainLine extends PositionData {
    show: boolean;
}

// Main组件里面重叠的Item数据
export interface Overlap {
    [propName: string]: string[];
}

// 导出代码的结果对象
export interface ExtractResult {
    css: string;
    sass: string;
    html: string;
    wxml: string;
}
