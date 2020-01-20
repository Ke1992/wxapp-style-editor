// CodeMirror相关的定义
interface CodeMirrorResult {
    setValue: Function;
    getValue: Function;
    setOption: Function;
}
interface CodeMirrorOptions {
    mode?: string;
    theme: string;
    lineNumbers: boolean;
}
declare function CodeMirror(element: HTMLDivElement, options: CodeMirrorOptions): CodeMirrorResult;
