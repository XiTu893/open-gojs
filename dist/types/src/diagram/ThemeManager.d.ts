import { Map } from '../core/Map';
/** 官方 ThemeManager：内置 light/dark 主题（Themes.Light / Themes.Dark），findValue 按目标属性类别取值 */
export declare class ThemeManager {
    static readonly className: string;
    private _diagram;
    private _themes;
    private _currentTheme;
    private _defaultTheme;
    /** 官方 ThemeManager.changesDivBackground —— go.js 里初值是 `UP=!1`，即**默认 false**。
     *  之前设成 true 会强行用主题 colors.div 覆盖样例 htmlContent 自带的 div 底色，
     *  arrowheads/orgChartStatic/connectionBoxNode 的 diff 直接从 5%/9%/17% 飙到 98%/63%/94%。 */
    private _changesDivBackground;
    constructor();
    get diagram(): any;
    set diagram(val: any);
    get currentTheme(): string;
    set currentTheme(val: string);
    get changesDivBackground(): boolean;
    set changesDivBackground(val: boolean);
    get defaultTheme(): string;
    set defaultTheme(val: string);
    /** 官方 ThemeManager.themeMap: Map<string, Theme> */
    get themeMap(): Map<string, any>;
    set themeMap(val: Map<string, any>);
    /** 官方 findTheme(themeName): Theme | null */
    findTheme(themeName: string): any;
    /**
     * 官方 `ThemeManager.set(themeName, props): this`
     * （go.js：`set(t,e){t===""&&(t=this.IP); t==="system"&&(t=this.um); …}`）
     * - `''` 表示「当前默认主题」，不是新建一个空名主题；
     * - 已存在的主题按类别（colors/fonts/numbers/…）**浅合并**，只覆盖给出的键；
     * - 返回 this。
     * 以前我们是整体替换且不处理 `''`，icons 样例
     * `themeManager.set('', {colors:{div:'#6495ED',…}})` 之后
     * `changesDivBackground = true` 取到的还是 light 的 `#fff`，整块底色不对。
     */
    set(themeName: string, themeData: any): this;
    private static _mergeTheme;
    private _applyTheme;
    findColor(colorName: string, themeName?: string): string;
    /**
     * 官方 `ThemeManager.findValue(key, path, targetProperty)` =
     * `getValue(themeMap.get(currentTheme), …) || getValue(themeMap.get(defaultTheme), …)`。
     */
    findValue(sourceKey: any, path: string | null, targetProperty: string): any;
    /**
     * 官方 `ThemeManager.getValue(theme, key, path, targetProperty)`：
     *  1. 先把 `path` 解析到**主题根**上，再在结果里取 `key`；
     *  2. 若得到 undefined 且 targetProperty 非空，则按目标属性取类别子对象
     *     （fill/stroke→colors、font→fonts…，查不到就 colors），**在类别内**重新解析
     *     `path`，再取 `key`。
     * `key` 若是 number 且值是数组，按 `key % length` 取下标。
     *
     * 以前第 2 步整段没实现：`themeData('fill','portColor','ports')` 的 `path='ports'`
     * 在主题根上找不到（实际在 `colors.ports`），于是返回 undefined、绑定被跳过，
     * dynamicPorts 的端口全是默认黑色（官方是 4 种彩色）。
     */
    private static _getValue;
    /**
     * 官方 `Diagram.setDivBackground(color)`：把主题的 `colors.div` 写到 div 的
     * background-color 上。官方 `ThemeManager.changesDivBackground`（默认 true）
     * 会在 addDiagram / currentTheme 变化时对所有注册图调用它。
     * 以前本项目没有这一步，于是 icons 样例整块底色是白的（官方是主题的 div 色）。
     */
    static applyDivBackground(diagram: any): void;
    /** 官方 ThemeManager.nV：目标属性 → 主题子类别 */
    private static _categoryOf;
}
