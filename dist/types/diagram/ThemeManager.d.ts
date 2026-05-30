export declare class ThemeManager {
    private _diagram;
    private _themes;
    private _currentTheme;
    get diagram(): any;
    set diagram(val: any);
    get currentTheme(): string;
    set currentTheme(val: string);
    set(themeName: string, themeData: any): void;
    private _applyTheme;
    findColor(colorName: string, themeName?: string): string;
}
