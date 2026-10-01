import { Model, ObjectData } from './Model';
import { ChangedEventProperty } from '../core/EnumValues';

/**
 * TreeModel - 树模型
 * 通过 parentKey 属性定义层级关系，无需 linkDataArray
 */
export class TreeModel extends Model {
  static readonly className: string = "TreeModel";
  public nodeParentKeyProperty: string = 'parent';

  constructor();
  constructor(init: Partial<TreeModel> | ObjectData[]);
  constructor(init?: Partial<TreeModel> | ObjectData[]) {
    super(Array.isArray(init) ? init : []);
    if (init && !Array.isArray(init)) {
      this.set(init);
    }
  }

  /** 获取节点的父节点 key */
  getParentKeyForNodeData(data: ObjectData): any {
    if (!data) return undefined;
    const prop = this.nodeParentKeyProperty;
    if (typeof prop === 'function') {
      return (prop as (data: ObjectData) => any)(data);
    }
    return data[prop];
  }

  /** 设置节点的父节点 key */
  setParentKeyForNodeData(data: ObjectData, key: any): void {
    if (!data) return;
    const prop = this.nodeParentKeyProperty;
    if (typeof prop === 'string') {
      this.setDataProperty(data, prop, key);
    }
  }


  // ============ 官方 TreeModel API 对齐（阶段 5） ============

  private _parentLinkCategoryProperty: string = 'parentLinkCategory';

  /** 官方 TreeModel.parentLinkCategoryProperty */
  get parentLinkCategoryProperty(): string {
    return this._parentLinkCategoryProperty;
  }
  set parentLinkCategoryProperty(value: string) {
    if (this._parentLinkCategoryProperty === value) return;
    const old = this._parentLinkCategoryProperty;
    this._parentLinkCategoryProperty = value;
    this.raiseChanged('parentLinkCategoryProperty', old, value);
  }

  /** 官方 TreeModel.linkCategoryProperty（TreeModel 里是 parentLinkCategoryProperty 的别名） */
  get linkCategoryProperty(): string {
    return this.parentLinkCategoryProperty;
  }
  set linkCategoryProperty(value: string) {
    this.parentLinkCategoryProperty = value;
  }

  get type(): string {
    return 'TreeModel';
  }

  /** 官方 TreeModel.maybeEnsureLinkReference */
  maybeEnsureLinkReference(key: any): any {
    return key;
  }

  /** 官方 TreeModel.getParentLinkCategoryForNodeData */
  getParentLinkCategoryForNodeData(data: ObjectData): string {
    if (data === null || data === undefined) return '';
    const prop = this.parentLinkCategoryProperty;
    if (prop === '') return '';
    const v = (data as any)[prop];
    if (v === undefined) return '';
    if (typeof v === 'string') return v;
    throw new Error(
      'getParentLinkCategoryForNodeData found a non-string category for ' + data + ': ' + v
    );
  }

  /** 官方 TreeModel.getLinkCategoryForData */
  getLinkCategoryForData(data: ObjectData): string {
    return this.getParentLinkCategoryForNodeData(data);
  }

  /** 官方 TreeModel.setParentLinkCategoryForNodeData */
  setParentLinkCategoryForNodeData(data: ObjectData, cat: string): void {
    if (data === null || data === undefined) return;
    const prop = this.parentLinkCategoryProperty;
    if (prop === '') return;
    if (!this.containsNodeData(data)) {
      this.setDataProperty(data, prop, cat);
      return;
    }
    const old = (data as any)[prop];
    const prev = old === undefined ? '' : old;
    if (prev === cat) return;
    this.setDataProperty(data, prop, cat);
    this.raiseChangedEvent(ChangedEventProperty, data, prop, prev, cat);
    this.updateTargetBindings(prop);
  }

  /** 官方 TreeModel.setLinkCategoryForData */
  setLinkCategoryForData(data: ObjectData, cat: string): void {
    this.setParentLinkCategoryForNodeData(data, cat);
  }

  toString(level?: number): string {
    let lv = level;
    if (lv === undefined) lv = 0;
    if (lv >= 2) return this.toJson();
    let str = (this.name !== '' ? this.name : '') + ' TreeModel';
    if (lv > 0) {
      str += '\n node data:';
      const arr = this.nodeDataArray;
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        str += ' ' + this.getKeyForNodeData(arr[i]) + ':' + TreeModel._stringifyData(arr[i]);
      }
    }
    return str;
  }

  private static _stringifyData(v: any): string {
    return v === undefined ? 'undefined' : v === null ? 'null' : v.toString();
  }


  toJson(_classname?: string): string {
    const data: any = {
      class: 'TreeModel',
      nodeDataArray: this.nodeDataArray,
    };
    if (Object.keys(this.modelData).length > 0) {
      data.modelData = this.modelData;
    }
    return JSON.stringify(data, null, 2);
  }

  static fromJson(json: string | object): TreeModel {
    // 与官方一致：子类不覆写反序列化语义，统一走 Model.fromJson 的类注册表
    return Model.fromJson(json) as TreeModel;
  }

  copy(): TreeModel {
    const m = new TreeModel();
    this.cloneProtected(m);
    m.nodeDataArray = this.nodeDataArray.map(d => this.cloneDeep(d));
    return m;
  }

  cloneProtected(copy: Model): void {
    super.cloneProtected(copy);
    const m = copy as TreeModel;
    m.nodeParentKeyProperty = this.nodeParentKeyProperty;
    m.parentLinkCategoryProperty = this.parentLinkCategoryProperty;
  }
}

// 注册到 Model.fromJson 的类表（详见 Model.registerClass 注释）。
Model.registerClass('TreeModel', TreeModel, (m, d) => {
  const t = m as TreeModel;
  if (d.nodeParentKeyProperty !== undefined) t.nodeParentKeyProperty = d.nodeParentKeyProperty;
  if (d.parentLinkCategoryProperty !== undefined) t.parentLinkCategoryProperty = d.parentLinkCategoryProperty;
});
