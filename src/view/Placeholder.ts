import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { StretchDefault } from '../core/EnumValues';
import type { Group } from './Group';

export class Placeholder extends GraphObject {
  private _padding: number = 0;

  constructor(init?: Partial<Placeholder>) {
    super();
    this._className = 'Placeholder';
    this._isPlaceholder = true;
    if (init) {
      this.set(init);
    }
  }

  get padding(): number {
    return this._padding;
  }
  set padding(val: number) {
    if (this._padding !== val) {
      this._padding = val;
      this._invalidateMeasure();
    }
  }

  get _placeholderBounds(): Rect {
    return this._actualBounds;
  }

  _measure(availW: number, availH: number): void {
    const group = this._findGroup();
    if (group) {
      let bounds: Rect | null = null;
      const groupPos = group.location;
      const it = group.memberParts.iterator;
      while (it.next()) {
        const part = it.value;
        if (!part.visible) continue;
        const partBounds = part.getDocumentBounds();
        const localBounds = new Rect(
          partBounds.x - groupPos.x,
          partBounds.y - groupPos.y,
          partBounds.width,
          partBounds.height
        );
        bounds = bounds ? bounds.union(localBounds) : localBounds;
      }
      const pad = this._padding;
      const w = bounds ? bounds.width : 0;
      const h = bounds ? bounds.height : 0;
      this._measuredBounds = new Rect(0, 0, w + pad * 2, h + pad * 2);
      this._naturalBounds = this._measuredBounds.copy();
    } else {
      this._measuredBounds = new Rect(0, 0, 0, 0);
      this._naturalBounds = this._measuredBounds.copy();
    }
    this._applySizeConstraints();
  }

  _arrange(bounds: Rect): void {
    this._actualBounds = bounds.copy();
  }

  private _findGroup(): Group | null {
    let p: any = this._panel;
    while (p) {
      if (p._memberParts !== undefined) return p as Group;
      p = p._panel;
    }
    return null;
  }

  copy(): Placeholder {
    const p = new Placeholder();
    this._copyPropertiesTo(p);
    p._padding = this._padding;
    return p;
  }
}

GraphObject.defineBuilder('Placeholder', Placeholder);
