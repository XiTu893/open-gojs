export class ThemeManager {
  private _diagram: any = null;
  private _themes: Record<string, any> = {};
  private _currentTheme: string = 'light';

  get diagram(): any { return this._diagram; }
  set diagram(val: any) { this._diagram = val; }

  get currentTheme(): string { return this._currentTheme; }
  set currentTheme(val: string) {
    this._currentTheme = val;
    this._applyTheme(val);
  }

  set(themeName: string, themeData: any): void {
    this._themes[themeName] = themeData;
  }

  private _applyTheme(themeName: string): void {
    const theme = this._themes[themeName];
    if (!theme || !this._diagram) return;
  }

  findColor(colorName: string, themeName?: string): string {
    const name = themeName || this._currentTheme;
    const theme = this._themes[name];
    if (!theme || !theme.colors) return '';
    return theme.colors[colorName] || '';
  }
}
