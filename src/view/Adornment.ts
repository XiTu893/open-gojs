import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import type { Placeholder } from './Placeholder';

/**
 * Adornment - 装饰
 * 用于选择手柄、工具提示、上下文菜单等
 */
export class Adornment extends Part {
  static readonly className: string = "Adornment";
  /** 被装饰的 GraphObject */
  private _adornedObject: GraphObject | null = null;
  /** 装饰类别 */
  private _adornmentCategory: string = '';

  constructor();
  constructor(type: any);
  constructor(type: any, init?: any);
  constructor(type?: any, init?: any) {
    const [t, i] = Panel._resolveArgs(type, init);
    super(t, undefined);
    this._className = 'Adornment';
    if (i) {
      this.set(i);
    }
  }

  get adornedObject(): GraphObject | null {
    return this._adornedObject;
  }
  set adornedObject(val: GraphObject | null) {
    this._adornedObject = val;
  }

  get adornedPart(): Part | null {
    if (!this._adornedObject) return null;
    if (this._adornedObject instanceof Part) return this._adornedObject;
    return this._adornedObject.part;
  }

  get adornedElement(): GraphObject | null {
    return this._adornedObject;
  }

  get category(): string {
    return this._adornmentCategory;
  }
  set category(val: string) {
    this._adornmentCategory = val;
  }

  /** 是否为占位装饰 */
  get isPlaceholder(): boolean {
    return false;
  }

  /**
   * 官方 `Adornment.placeholder`：本 Adornment 面板树中第一个 Placeholder。
   * 官方缓存在内部字段（`vt`），本项目按需递归查找。
   */
  get placeholder(): Placeholder | null {
    return Adornment._findPlaceholder(this);
  }

  private static _findPlaceholder(panel: Panel): Placeholder | null {
    const elements = panel._elements;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if ((el as unknown as { _isPlaceholder?: boolean })._isPlaceholder) {
        return el as unknown as Placeholder;
      }
      if (el instanceof Panel) {
        const found = Adornment._findPlaceholder(el);
        if (found !== null) return found;
      }
    }
    return null;
  }

  hasPlaceholder(): boolean {
    return this.placeholder !== null;
  }

  copy(): Adornment {
    const a = new Adornment();
    this._copyPropertiesTo(a);
    this._copyPanelPropertiesTo(a as any);
    this._copyPartPropertiesTo(a);
    a._adornmentCategory = this._adornmentCategory;
    return a;
  }
}

GraphObject.defineBuilder('Adornment', Adornment);
