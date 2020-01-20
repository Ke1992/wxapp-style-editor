// 分类数据对象
export interface CategoryData {
    key: string;
    text: string;
}

// css数据模型对象
export interface CssModel {
    [propName: string]: {
        css: string; // 自身的css样式
        line: number; // 规则对应的行数
        selectors: string[]; // 所有的选择器
        isModified: boolean; // 是否修改过
    };
}

// mock的列表item数据对象
export interface MockItemData {
    id: number;
    name: string;
    cover: string;
}

// mock的底层数据
export interface MockData extends MockItemData {
    wxml: string;
    sass: string;
    category: string;
    extraSass: string;
}

// demo数据对象
export interface DemoData {
    css: string;
    html: string;
    extraCss: string;
    cssModel: CssModel;
}

// sass转换成css后的结果对象
export interface CssResult {
    css: string; // 转换后的样式
    map: string; // source-map
}

// 导出代码的结果对象
export interface ExtractResult {
    css: string;
    sass: string;
    html: string;
    wxml: string;
}

// source-map生成的数据
export interface SourceMapData {
    [propName: string]: string; // key: line_xx；value: css
}

// 新增/修改的UI数据
export interface IncreaseData {
    name: string;
    wxml: string;
    sass: string;
    cover: string;
    category: string;
    extraSass: string;
}
