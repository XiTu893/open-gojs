import { Margin } from '../core/Margin';
import { Map } from '../core/Map';

/** 官方 ThemeManager：内置 light/dark 主题（Themes.Light / Themes.Dark），findValue 按目标属性类别取值 */
export class ThemeManager {
  static readonly className: string = "ThemeManager";
  private _diagram: any = null;
  // 官方 ThemeManager.themeMap 是 `Map<string, Theme>`（go.d.ts 有 get/set themeMap）。
  // 以前只存在私有 Record 里，样例 `themeManager.themeMap.get(currentTheme).colors[x]`
  // 直接 undefined（实测 icons）。
  private _themes: Map<string, any> = new Map<string, any>();
  private _currentTheme: string = 'light';
  private _defaultTheme: string = 'light';
  /** 官方 ThemeManager.changesDivBackground —— go.js 里初值是 `UP=!1`，即**默认 false**。
   *  之前设成 true 会强行用主题 colors.div 覆盖样例 htmlContent 自带的 div 底色，
   *  arrowheads/orgChartStatic/connectionBoxNode 的 diff 直接从 5%/9%/17% 飙到 98%/63%/94%。 */
  private _changesDivBackground: boolean = false;

  constructor() {
    // 官方 ThemeManager 构造：未提供 themeMap 时内置 light/dark 两套
    this._themes.set('light', {
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
    });
    this._themes.set('dark', {
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
    });
  }

  get diagram(): any { return this._diagram; }
  set diagram(val: any) { this._diagram = val; }

  get currentTheme(): string { return this._currentTheme; }
  set currentTheme(val: string) {
    if (this._currentTheme === val) return;
    this._currentTheme = val;
    this._applyTheme(val);
    ThemeManager.applyDivBackground(this._diagram);
  }

  get changesDivBackground(): boolean { return this._changesDivBackground; }
  set changesDivBackground(val: boolean) {
    if (this._changesDivBackground === val) return;
    this._changesDivBackground = val;
    if (val) ThemeManager.applyDivBackground(this._diagram);
  }

  get defaultTheme(): string { return this._defaultTheme; }
  set defaultTheme(val: string) { this._defaultTheme = val; }

  /** 官方 ThemeManager.themeMap: Map<string, Theme> */
  get themeMap(): Map<string, any> { return this._themes; }
  set themeMap(val: Map<string, any>) { this._themes = val || new Map<string, any>(); }

  /** 官方 findTheme(themeName): Theme | null */
  findTheme(themeName: string): any {
    const t = this._themes.get(themeName);
    return t === undefined ? null : t;
  }

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
set(themeName: string, themeData: any): this {
    let name = themeName;
    if (name === '') name = this._defaultTheme;
    if (name === 'system') name = 'light';
    const existing = this._themes.get(name);
    const merged = existing !== undefined && existing !== null
      ? ThemeManager._mergeTheme(existing, themeData)
      : themeData;
    this._themes.set(name, merged);
    this._applyTheme(name);
    ThemeManager.applyDivBackground(this._diagram);
    return this;
  }

  private static _mergeTheme(oldTheme: any, newProps: any): any {
    if (!newProps || typeof newProps !== 'object') return oldTheme;
    const out: any = { ...oldTheme };
    for (const key of Object.keys(newProps)) {
      const nv = newProps[key];
      const ov = oldTheme ? oldTheme[key] : undefined;
      if (nv && typeof nv === 'object' && !Array.isArray(nv) && ov && typeof ov === 'object' && !Array.isArray(ov)) {
        out[key] = { ...ov, ...nv };
      } else {
        out[key] = nv;
      }
    }
    return out;
  }

  private _applyTheme(themeName: string): void {
    const theme = this._themes.get(themeName);
    if (!theme || !this._diagram) return;
    if (typeof this._diagram.updateAllThemeBindings === 'function') {
      this._diagram.updateAllThemeBindings();
    }
  }

  findColor(colorName: string, themeName?: string): string {
    const name = themeName || this._currentTheme;
    const theme = this._themes.get(name);
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
      const theme = this._themes.get(name);
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

  /**
   * 官方 `Diagram.setDivBackground(color)`：把主题的 `colors.div` 写到 div 的
   * background-color 上。官方 `ThemeManager.changesDivBackground`（默认 true）
   * 会在 addDiagram / currentTheme 变化时对所有注册图调用它。
   * 以前本项目没有这一步，于是 icons 样例整块底色是白的（官方是主题的 div 色）。
   */
  static applyDivBackground(diagram: any): void {
    if (!diagram || !diagram.themeManager) return;
    const tm = diagram.themeManager;
    if (!tm.changesDivBackground) return;
    const color = tm.findValue('div', '', 'fill');
    if (typeof color === 'string' && color !== '') {
      diagram.setDivBackground(color);
    }
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
