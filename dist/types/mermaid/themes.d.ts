/**
 * Mermaid 渲染主题 —— 提供"零配置也好看"的默认配色体系。
 *
 * 每个主题定义节点/连线/文本的配色、圆角、字体、间距。映射器按节点类别
 * 打上 `category`/`style` 字段，渲染模板据此取色。用户可传自定义主题覆盖，
 * 未传即用 `default`。
 */
/** 节点类别（映射到不同配色，自动轮换） */
export type NodeCategory = 'process' | 'decision' | 'startend' | 'subroutine' | 'storage' | 'inputoutput' | 'group' | 'class' | 'state' | 'er' | 'participant' | 'note';
/** 一个类别的配色 */
export interface CategoryStyle {
    fill: string;
    stroke: string;
    text: string;
    strokeWidth: number;
}
/** 连线样式 */
export interface EdgeStyle {
    solid: string;
    dotted: string;
    thick: string;
    dashed: string;
    label: string;
    labelBg: string;
}
/** 主题 */
export interface MermaidTheme {
    name: string;
    background: string;
    fontFamily: string;
    fontSize: {
        title: number;
        node: number;
        label: number;
    };
    nodeRadius: number;
    shadow: {
        blur: number;
        color: string;
    };
    nodeSpacing: number;
    /** 分类/扇区等的轮换色（gantt section、pie 扇区按序取色） */
    series: string[];
    categories: Record<NodeCategory, CategoryStyle>;
    edge: EdgeStyle;
}
/**
 * 默认主题 —— GoJS 原生黑白风格：
 * 白底、黑边、黑字、无阴影、黑色 Standard 箭头；容器浅灰底。
 * series 为灰阶轮换（gantt/pie 深浅交替区分）。
 */
export declare const defaultTheme: MermaidTheme;
/** 中性主题 —— 文档/打印，低饱和克制 */
export declare const neutralTheme: MermaidTheme;
/** 森林主题 —— 绿棕大地色系 */
export declare const forestTheme: MermaidTheme;
/** 暗色主题 —— 演示/暗底 */
export declare const darkTheme: MermaidTheme;
/** 主题注册表 */
export declare const themes: Record<string, MermaidTheme>;
/** 按名称取主题，未知名回退到 default */
export declare function getTheme(name?: string): MermaidTheme;
/** 依据背景明暗，返回文字应取白还是深色（对比度保证） */
export declare function contrastText(bg: string): string;
