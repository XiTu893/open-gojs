/**
 * Mermaid 渲染主题 —— 提供"零配置也好看"的默认配色体系。
 *
 * 每个主题定义节点/连线/文本的配色、圆角、字体、间距。映射器按节点类别
 * 打上 `category`/`style` 字段，渲染模板据此取色。用户可传自定义主题覆盖，
 * 未传即用 `default`。
 */

/** 节点类别（映射到不同配色，自动轮换） */
export type NodeCategory =
  | 'process'      // 主流程（默认矩形）
  | 'decision'     // 菱形
  | 'startend'     // 圆角起止
  | 'subroutine'   // 子程序
  | 'storage'      // 圆柱/数据库
  | 'inputoutput'  // 输入输出
  | 'group'        // subgraph 容器
  | 'class'        // 类图
  | 'state'        // 状态图
  | 'er'           // 实体表
  | 'participant'  // 时序图参与者
  | 'note';        // 时序图说明

/** 一个类别的配色 */
export interface CategoryStyle {
  fill: string;
  stroke: string;
  text: string;
  strokeWidth: number;
  /** 按类别异色的阴影（pageFlow 风格）；缺省用 theme.shadow.color */
  shadow?: string;
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
  fontSize: { title: number; node: number; label: number };
  nodeRadius: number;
  shadow: { blur: number; color: string };
  nodeSpacing: number;
  /** 分类/扇区等的轮换色（gantt section、pie 扇区按序取色） */
  series: string[];
  categories: Record<NodeCategory, CategoryStyle>;
  edge: EdgeStyle;
}

/**
 * 默认主题 —— pageFlow.html 风格：饱和彩色节点 + 按类别彩色阴影（blur 2 / offset 4,6），
 * 连线深藏青 #0D2C54，白底。series 为 pageFlow 五主色轮换（gantt/pie 扇区）。
 */
export const defaultTheme: MermaidTheme = {
  name: 'default',
  background: '#ffffff',
  fontFamily: 'Segoe UI, -apple-system, Roboto, Helvetica, Arial, sans-serif',
  fontSize: { title: 18, node: 13, label: 11 },
  nodeRadius: 8,
  shadow: { blur: 2, color: '#404050' },
  nodeSpacing: 30,
  series: ['#00A6ED', '#FFB400', '#7FB800', '#D73909', '#DCE9F9', '#407090', '#C98A00', '#406050'],
  categories: {
    process: { fill: '#00A6ED', stroke: '#0077B6', text: '#000000', strokeWidth: 1.5, shadow: '#407090' },
    decision: { fill: '#FFB400', stroke: '#C98A00', text: '#000000', strokeWidth: 1.5, shadow: '#804040' },
    startend: { fill: '#7FB800', stroke: '#5A8500', text: '#000000', strokeWidth: 1.5, shadow: '#406050' },
    subroutine: { fill: '#DCE9F9', stroke: '#407090', text: '#0D2C54', strokeWidth: 1.5, shadow: '#404050' },
    storage: { fill: '#FFE3DB', stroke: '#D73909', text: '#7A2208', strokeWidth: 1.5, shadow: '#705020' },
    inputoutput: { fill: '#FFF1C9', stroke: '#C98A00', text: '#4A3400', strokeWidth: 1.5, shadow: '#804040' },
    group: { fill: '#F2F6FA', stroke: '#B3C7DB', text: '#23395B', strokeWidth: 1 },
    class: { fill: '#DCE9F9', stroke: '#407090', text: '#0D2C54', strokeWidth: 1.5, shadow: '#404050' },
    state: { fill: '#E4F2D2', stroke: '#5A8500', text: '#2A3A00', strokeWidth: 1.5, shadow: '#406050' },
    er: { fill: '#FFE3DB', stroke: '#D73909', text: '#7A2208', strokeWidth: 1.5, shadow: '#705020' },
    participant: { fill: '#DCE9F9', stroke: '#407090', text: '#0D2C54', strokeWidth: 1, shadow: '#404050' },
    note: { fill: '#FFF7DE', stroke: '#C9A86A', text: '#4A3400', strokeWidth: 1, shadow: '#804040' },
  },
  edge: {
    solid: '#0D2C54',
    dotted: '#4A6A8F',
    thick: '#0D2C54',
    dashed: '#7A93B5',
    label: '#0D2C54',
    labelBg: 'rgba(255,255,255,0.9)',
  },
};

/** 中性主题 —— 文档/打印，低饱和克制 */
export const neutralTheme: MermaidTheme = {
  ...defaultTheme,
  name: 'neutral',
  background: '#ffffff',
  series: ['#4a5a78', '#7c8aa8', '#a9b4c8', '#c9d1de', '#5d6b84', '#8d99b0', '#b8c0d0', '#dde2ea'],
  categories: {
    ...defaultTheme.categories,
    process: { fill: '#e8edf5', stroke: '#8fa1c4', text: '#2b3a55', strokeWidth: 1 },
    decision: { fill: '#f4ead6', stroke: '#c9a86a', text: '#4a3a1a', strokeWidth: 1 },
    startend: { fill: '#e2efe4', stroke: '#6fae7d', text: '#1d3a24', strokeWidth: 1 },
    subroutine: { fill: '#ece6f5', stroke: '#9b84d0', text: '#342a52', strokeWidth: 1 },
    storage: { fill: '#e0eef5', stroke: '#6fa8c4', text: '#143a4a', strokeWidth: 1 },
    inputoutput: { fill: '#f5e6ee', stroke: '#c47fa0', text: '#4a1a30', strokeWidth: 1 },
    group: { fill: '#f5f7fa', stroke: '#d5dce8', text: '#3a4558', strokeWidth: 1 },
    class: { fill: '#e8edf5', stroke: '#8fa1c4', text: '#2b3a55', strokeWidth: 1 },
    state: { fill: '#e2efe4', stroke: '#6fae7d', text: '#1d3a24', strokeWidth: 1 },
    er: { fill: '#e0eef5', stroke: '#6fa8c4', text: '#143a4a', strokeWidth: 1 },
    participant: { fill: '#f2f4f8', stroke: '#b9c4d6', text: '#3a4558', strokeWidth: 1 },
    note: { fill: '#f8f4e8', stroke: '#c9b87a', text: '#4a3a1a', strokeWidth: 1 },
  },
  edge: { solid: '#9aa5b5', dotted: '#c4cdd9', thick: '#7a8db5', dashed: '#cdd5e0', label: '#556070', labelBg: 'rgba(255,255,255,0.85)' },
};

/** 森林主题 —— 绿棕大地色系 */
export const forestTheme: MermaidTheme = {
  ...defaultTheme,
  name: 'forest',
  background: '#fafaf5',
  series: ['#3d6b3d', '#5a8f5a', '#8a9e5a', '#b4a86a', '#4a7a5a', '#6f9a4a', '#9aad72', '#c5cfa8'],
  categories: {
    ...defaultTheme.categories,
    process: { fill: '#5a8f5a', stroke: '#3d6b3d', text: '#ffffff', strokeWidth: 1.5 },
    decision: { fill: '#c9973e', stroke: '#9a7023', text: '#3a2a00', strokeWidth: 1.5 },
    startend: { fill: '#7a9e3a', stroke: '#5a7a26', text: '#ffffff', strokeWidth: 1.5 },
    subroutine: { fill: '#8a6f5a', stroke: '#6b523d', text: '#ffffff', strokeWidth: 1.5 },
    storage: { fill: '#4a8a6f', stroke: '#2f6b52', text: '#ffffff', strokeWidth: 1.5 },
    inputoutput: { fill: '#b86f4a', stroke: '#925238', text: '#ffffff', strokeWidth: 1.5 },
    group: { fill: '#f2f5e8', stroke: '#cdd6b4', text: '#3a4a2a', strokeWidth: 1 },
    class: { fill: '#5a8f5a', stroke: '#3d6b3d', text: '#ffffff', strokeWidth: 1.5 },
    state: { fill: '#7a9e3a', stroke: '#5a7a26', text: '#ffffff', strokeWidth: 1.5 },
    er: { fill: '#4a8a6f', stroke: '#2f6b52', text: '#ffffff', strokeWidth: 1.5 },
    participant: { fill: '#eef5e8', stroke: '#b4cda0', text: '#2a4a2a', strokeWidth: 1 },
    note: { fill: '#f5f0e0', stroke: '#c9b87a', text: '#4a3a1a', strokeWidth: 1 },
  },
  edge: { solid: '#7a8a6f', dotted: '#aabaa0', thick: '#5a8f5a', dashed: '#bcc9b4', label: '#4a5542', labelBg: 'rgba(255,255,255,0.85)' },
};

/** 暗色主题 —— 演示/暗底 */
export const darkTheme: MermaidTheme = {
  name: 'dark',
  background: '#1e2433',
  fontFamily: defaultTheme.fontFamily,
  fontSize: defaultTheme.fontSize,
  nodeRadius: 8,
  shadow: { blur: 8, color: 'rgba(0,0,0,0.4)' },
  nodeSpacing: 30,
  series: ['#7b96ff', '#4ec469', '#ffb84d', '#ff7fa9', '#b58aff', '#3fb3ef', '#5aa9c4', '#8fa8d8'],
  categories: {
    process: { fill: '#5b7cff', stroke: '#3b57d6', text: '#ffffff', strokeWidth: 1.5 },
    decision: { fill: '#ffb84d', stroke: '#d6931a', text: '#1a1200', strokeWidth: 1.5 },
    startend: { fill: '#4ec469', stroke: '#2f9e44', text: '#ffffff', strokeWidth: 1.5 },
    subroutine: { fill: '#b58aff', stroke: '#8f5bef', text: '#ffffff', strokeWidth: 1.5 },
    storage: { fill: '#3fb3ef', stroke: '#1c8fc9', text: '#ffffff', strokeWidth: 1.5 },
    inputoutput: { fill: '#ff7fa9', stroke: '#e0507f', text: '#ffffff', strokeWidth: 1.5 },
    group: { fill: '#2a3248', stroke: '#3d4a6b', text: '#c8d4f0', strokeWidth: 1 },
    class: { fill: '#5b7cff', stroke: '#3b57d6', text: '#ffffff', strokeWidth: 1.5 },
    state: { fill: '#4ec469', stroke: '#2f9e44', text: '#ffffff', strokeWidth: 1.5 },
    er: { fill: '#3fb3ef', stroke: '#1c8fc9', text: '#ffffff', strokeWidth: 1.5 },
    participant: { fill: '#242e45', stroke: '#3d4a6b', text: '#c8d4f0', strokeWidth: 1 },
    note: { fill: '#3a3420', stroke: '#8a7a3a', text: '#f0e6c8', strokeWidth: 1 },
  },
  edge: { solid: '#9aa5c4', dotted: '#66708f', thick: '#5b7cff', dashed: '#566180', label: '#c8d4f0', labelBg: 'rgba(30,36,51,0.85)' },
};

/** 主题注册表 */
export const themes: Record<string, MermaidTheme> = {
  default: defaultTheme,
  neutral: neutralTheme,
  forest: forestTheme,
  dark: darkTheme,
};

/** 按名称取主题，未知名回退到 default */
export function getTheme(name?: string): MermaidTheme {
  if (!name) return defaultTheme;
  return themes[name] ?? defaultTheme;
}

/** 依据背景明暗，返回文字应取白还是深色（对比度保证） */
export function contrastText(bg: string): string {
  // 解析 #rrggbb
  const m = /^#?([0-9a-f]{6})$/i.exec(bg);
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  // 感知亮度（ITU-R BT.709）
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 140 ? '#1a2233' : '#ffffff';
}