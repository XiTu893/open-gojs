import { Part } from './Part';
import { GraphObject } from './GraphObject';
import type { Panel } from './Panel';
import type { Placeholder } from './Placeholder';

/**
 * Adornment - 装饰
 * 用于选择手柄、工具提示、上下文菜单等
 */
export class Adornment extends Part {
  /** 被装饰的 GraphObject */
  private _adornedObject: GraphObject | null = null;
  /** 装饰类别 */
  private _adornmentCategory: string = '';

  constructor();
  constructor(type: any);
  constructor(type: any, init?: any);
  constructor(type?: any, init?: any) {
    super();
    this._className = 'Adornment';
    if (type !== undefined) {
      this._type = type;
    }
    if (init) {
      this.set(init);
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

  hasPlaceholder(): boolean {
    const checkForPlaceholder = (obj: GraphObject): boolean => {
      if ((obj as any)._isPlaceholder) return true;
      if ((obj as any)._elements) {
        for (const child of (obj as any)._elements) {
          if (checkForPlaceholder(child)) return true;
        }
      }
      return false;
    };
    return checkForPlaceholder(this);
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
