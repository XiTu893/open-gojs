import { Margin } from '../core/Margin';

/** 官方 ThemeManager：内置 light/dark 主题（Themes.Light / Themes.Dark），findValue 按目标属性类别取值 */
export class ThemeManager {
  static readonly className: string = "ThemeManager";
  private _diagram: any = null;
  private _themes: Record<string, any> = {};
  private _currentTheme: string = 'light';
  private _defaultTheme: string = 'light';

  constructor() {
    // 官方 ThemeManager 构造：未提供 themeMap 时内置 light/dark 两套
    this._themes['light'] = {
      colors: {
        text: '#0a0a0a',
        comment: '#ca8a04',
        link: '#0a0a0a',
        group: '#a3a3a344',
        outline: '#a3a3a3',
        selection: '#0ea5e9',
        div: '#fff',
        gridMinor: '#e5e5e5',
        gridMajor: '#a3a3a3',
        overviewBox: '#c026d3',
        tempLink: '#2563eb',
        tempPort: '#c026d3',
        adornmentFill: '#0ea5e9',
        adornmentStroke: '#1e40af',
        dragSelect: '#c026d3'
      },
      fonts: { normal: '10pt sans-serif', bold: 'bold 12pt sans-serif' },
      numbers: { group: 1, selection: 3 },
      margins: { group: new Margin(5) },
      arrowheads: { toArrow: 'Standard' }
    };
    this._themes['dark'] = {
      colors: {
        text: '#f5f5f5',
        comment: '#facc15',
        link: '#f5f5f5',
        group: '#a3a3a388',
        outline: '#a3a3a3',
        selection: '#38bdf8',
        div: '#171717',
        gridMinor: '#262626',
        gridMajor: '#404040',
        overviewBox: '#e879f9',
        tempLink: '#60a5fa',
        tempPort: '#e879f9',
        adornmentFill: '#38bdf8',
        adornmentStroke: '#2563eb',
        dragSelect: '#e879f9'
      },
      fonts: { normal: '10pt sans-serif', bold: 'bold 12pt sans-serif' },
      numbers: { group: 1, selection: 3 },
      margins: { group: new Margin(5) },
      arrowheads: { toArrow: 'Standard' }
    };
  }

  get diagram(): any { return this._diagram; }
  set diagram(val: any) { this._diagram = val; }

  get currentTheme(): string { return this._currentTheme; }
  set currentTheme(val: string) {
    if (this._currentTheme === val) return;
    this._currentTheme = val;
    this._applyTheme(val);
  }

  get defaultTheme(): string { return this._defaultTheme; }
  set defaultTheme(val: string) { this._defaultTheme = val; }

  set(themeName: string, themeData: any): void {
    this._themes[themeName] = themeData;
  }

  private _applyTheme(themeName: string): void {
    const theme = this._themes[themeName];
    if (!theme || !this._diagram) return;
    if (typeof this._diagram.updateAllThemeBindings === 'function') {
      this._diagram.updateAllThemeBindings();
    }
  }

  findColor(colorName: string, themeName?: string): string {
    const name = themeName || this._currentTheme;
    const theme = this._themes[name];
    if (!theme || !theme.colors) return '';
    return theme.colors[colorName] || '';
  }

  /**
   * 官方 ThemeManager.findValue(key, path, targetProperty)：
   * 先按目标属性查类别（stroke/fill→colors、font→fonts…），再在 currentTheme → defaultTheme 里取值。
   */
  findValue(sourceKey: string, path: string | null, targetProperty: string): any {
    const cat = ThemeManager._categoryOf(targetProperty);
    const names = this._currentTheme === this._defaultTheme
      ? [this._currentTheme]
      : [this._currentTheme, this._defaultTheme];
    for (const name of names) {
      const theme = this._themes[name];
      if (!theme) continue;
      let scope: any = theme;
      if (path) {
        for (const p of path.split('.')) {
          scope = scope ? scope[p] : undefined;
        }
        if (scope === undefined || scope === null) continue;
      } else {
        scope = cat && theme[cat] !== undefined ? theme[cat] : theme;
      }
      if (scope && typeof scope === 'object') {
        const v = scope[sourceKey];
        if (v !== undefined) return v;
      }
    }
    return undefined;
  }

  /** 官方 ThemeManager.nV：目标属性 → 主题子类别 */
  private static _categoryOf(targetProperty: string): string | null {
    switch (targetProperty) {
      case 'fill':
      case 'stroke':
      case 'background':
      case 'shadowColor':
      case 'defaultColumnSeparatorStroke':
      case 'defaultRowSeparatorStroke':
        return 'colors';
      case 'font':
        return 'fonts';
      case 'width':
      case 'height':
      case 'scale':
      case 'opacity':
      case 'strokeWidth':
      case 'curviness':
      case 'parameter1':
      case 'parameter2':
        return 'numbers';
      case 'margin':
      case 'padding':
      case 'defaultSeparatorPadding':
        return 'margins';
      case 'fromArrow':
      case 'toArrow':
        return 'arrowheads';
      case 'desiredSize':
        return 'sizes';
      default:
        return 'colors';
    }
  }
}
