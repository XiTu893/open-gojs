import { List } from '../core/List';
import { Iterator } from '../core/Iterable';

/**
 * Layer - 图层
 * 控制绘制顺序和可见性
 */
export class Layer {
  /** 图层名称 */
  public name: string;
  /** 不透明度 */
  public opacity: number;
  /** 是否可见 */
  public visible: boolean;
  /** 是否为临时图层 */
  public isTemporary: boolean;
  /** Z 序 */
  public zIndex: number;
  /** 所属 Diagram */
  private _diagram: any;
  /** 图层中的 Part 集合 */
  private _parts: List<any>;

  constructor() {
    this.name = '';
    this.opacity = 1;
    this.visible = true;
    this.isTemporary = false;
    this.zIndex = 0;
    this._diagram = null;
    this._parts = new List();
  }

  get diagram(): any {
    return this._diagram;
  }
  set diagram(val: any) {
    this._diagram = val;
  }

  get parts(): Iterator<any> {
    return this._parts.iterator;
  }

  get partsCount(): number {
    return this._parts.count;
  }

  /** 添加 Part */
  add(part: any): void {
    this._parts.add(part);
  }

  /** 移除 Part */
  remove(part: any): boolean {
    return this._parts.remove(part);
  }

  /** 清空 */
  clear(): void {
    this._parts.clear();
  }

  /** 是否包含 Part */
  contains(part: any): boolean {
    return this._parts.contains(part);
  }
}
