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
   * 官方 `ThemeManager.findValue(key, path, targetProperty)` =
   * `getValue(themeMap.get(currentTheme), …) || getValue(themeMap.get(defaultTheme), …)`。
   */
  findValue(sourceKey: any, path: string | null, targetProperty: string): any {
    return ThemeManager._getValue(this.findTheme(this._currentTheme), sourceKey, path, targetProperty)
      || ThemeManager._getValue(this.findTheme(this._defaultTheme), sourceKey, path, targetProperty);
  }

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
  private static _getValue(theme: any, key: any, path: string | null, targetProperty: string): any {
    if (!theme) return undefined;
    const p = path === null || path === undefined ? '' : path;
    let n: any = theme;
    /** 官方 `o(l)`：在当前 n 上解析 l；点号串/数组会**改写 n**，单段则只读 */
    const resolve = (l: any): any => {
      if (n === undefined || n === null || l === '' || l === null || l === undefined) return undefined;
      if (typeof l === 'number' || !(Array.isArray(l) || String(l).indexOf('.') >= 0)) return n[l];
      const a: string[] = Array.isArray(l) ? l : String(l).split('.');
      for (let h = 0; h < a.length; h++) {
        const c = a[h];
        if (c !== '') {
          n = n[c];
          if (n === undefined) return undefined;
        }
      }
      return n;
    };
    /** 官方 `r()`：先解析 path（若有），再取 key（数组 + 数字 key → 下标） */
    const resolveKey = (): any => {
      if (p !== '') {
        n = resolve(p);
        if (n === undefined) return undefined;
      }
      n = Array.isArray(n) && typeof key === 'number' ? n[key % n.length] : resolve(key);
      return n;
    };
    if ((n = resolveKey(), n !== undefined)) return n;
    if (typeof targetProperty === 'string' && targetProperty.length > 0) {
      const cat = ThemeManager._categoryOf(targetProperty) || 'colors';
      n = theme[cat] !== undefined ? theme[cat] : theme.colors;
      if ((n = resolveKey(), n !== undefined)) return n;
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
