/** 官方 ThemeManager：内置 light/dark 主题（Themes.Light / Themes.Dark），findValue 按目标属性类别取值 */
export declare class ThemeManager {
    static readonly className: string;
    private _diagram;
    private _themes;
    private _currentTheme;
    private _defaultTheme;
    constructor();
    get diagram(): any;
    set diagram(val: any);
    get currentTheme(): string;
    set currentTheme(val: string);
    get defaultTheme(): string;
    set defaultTheme(val: string);
    set(themeName: string, themeData: any): void;
    private _applyTheme;
    findColor(colorName: string, themeName?: string): string;
    /**
     * 官方 ThemeManager.findValue(key, path, targetProperty)：
     * 先按目标属性查类别（stroke/fill→colors、font→fonts…），再在 currentTheme → defaultTheme 里取值。
     */
    findValue(sourceKey: string, path: string | null, targetProperty: string): any;
    /** 官方 ThemeManager.nV：目标属性 → 主题子类别 */
    private static _categoryOf;
}
