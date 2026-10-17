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
  categories: Record<NodeCategory, CategoryStyle>;
  edge: EdgeStyle;
}

/**
 * 默认主题 —— 高辨识度、低饱和、对比达标的调色板。
 * 蓝(主流程)/琥珀(决策)/绿(起止)/紫(子程序)/青(存储)/玫红(IO) 轮换。
 */
export const defaultTheme: MermaidTheme = {
  name: 'default',
  background: '#ffffff',
  fontFamily: 'Segoe UI, -apple-system, Roboto, Helvetica, Arial, sans-serif',
  fontSize: { title: 18, node: 13, label: 11 },
  nodeRadius: 8,
  shadow: { blur: 6, color: 'rgba(0,0,0,0.15)' },
  nodeSpacing: 30,
  categories: {
    process: { fill: '#4f6df5', stroke: '#3350cc', text: '#ffffff', strokeWidth: 1.5 },
    decision: { fill: '#f5a623', stroke: '#c87f0a', text: '#3a2a00', strokeWidth: 1.5 },
    startend: { fill: '#2f9e44', stroke: '#1f6b2e', text: '#ffffff', strokeWidth: 1.5 },
    subroutine: { fill: '#9b6bf5', stroke: '#7a45d8', text: '#ffffff', strokeWidth: 1.5 },
    storage: { fill: '#1c9ad6', stroke: '#0f6c94', text: '#ffffff', strokeWidth: 1.5 },
    inputoutput: { fill: '#e05b8d', stroke: '#b83a6a', text: '#ffffff', strokeWidth: 1.5 },
    group: { fill: '#f1f5ff', stroke: '#c5d3f7', text: '#3a4a8a', strokeWidth: 1 },
    class: { fill: '#4f6df5', stroke: '#3350cc', text: '#ffffff', strokeWidth: 1.5 },
    state: { fill: '#2f9e44', stroke: '#1f6b2e', text: '#ffffff', strokeWidth: 1.5 },
    er: { fill: '#1c9ad6', stroke: '#0f6c94', text: '#ffffff', strokeWidth: 1.5 },
    participant: { fill: '#eef2ff', stroke: '#9db3f7', text: '#2c3e8a', strokeWidth: 1 },
    note: { fill: '#fff8e1', stroke: '#e6c95a', text: '#6b4d00', strokeWidth: 1 },
  },
  edge: {
    solid: '#8a94a6',
    dotted: '#b9c2d2',
    thick: '#4f6df5',
    dashed: '#c0c8d8',
    label: '#4a5568',
    labelBg: 'rgba(255,255,255,0.85)',
  },
};

/** 中性主题 —— 文档/打印，低饱和克制 */
export const neutralTheme: MermaidTheme = {
  ...defaultTheme,
  name: 'neutral',
  background: '#ffffff',
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