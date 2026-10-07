import { Model, ObjectData } from './Model';
import { ChangedEvent } from './ChangedEvent';
import { Map } from '../core/Map';
import { ChangedEventInsert, ChangedEventRemove, ChangedEventProperty } from '../core/EnumValues';
import { List } from '../core/List';
import { Set } from '../core/Set';

/**
 * GraphLinksModel - 图连接模型
 * 额外管理 linkDataArray，支持任意拓扑
 */
export class GraphLinksModel extends Model {
  static readonly className: string = "GraphLinksModel";
  /** 链接 from 属性名 */
  public linkFromKeyProperty: string = 'from';
  /** 链接 to 属性名 */
  public linkToKeyProperty: string = 'to';
  /** 链接 fromPort 属性名 */
  public linkFromPortIdProperty: string = 'fromPort';
  /** 链接 toPort 属性名 */
  public linkToPortIdProperty: string = 'toPort';
  /** 链接分类属性名 */
  public linkCategoryProperty: string = 'category';
  /** 链接点数据属性名 */
  public linkKeyProperty: string = '';
  /** 是否自动创建缺失的节点 */
  public createMissingNodeData: boolean = false;

  private _linkDataArray: ObjectData[] = [];
  private _linkKeyMap: Map<any, ObjectData> = new Map();
  private _nextLinkKey: number = -1;

  constructor();
  constructor(init: Partial<GraphLinksModel> | ObjectData[], linkDataArray?: ObjectData[]);
  constructor(init?: Partial<GraphLinksModel> | ObjectData[], linkDataArray?: ObjectData[]) {
    super(Array.isArray(init) ? init : []);
    if (init && !Array.isArray(init)) {
      this.set(init);
    }
    // 第二个参数优先；不能覆盖 set(init) 中已通过 linkDataArray 属性设置的值
    if (linkDataArray) {
      // 官方 GraphLinksModel 构造器走 setter（含 key 补齐两趟）
      this.linkDataArray = linkDataArray;
    }
    // set(init) 中属性的赋值顺序不保证 archetypeNodeData 先于 linkDataArray，
    // 因此在所有属性就位后再统一补齐 archetype 节点
    for (const ld of this._linkDataArray) this._ensureArchetypeNodesForLinkData(ld);
    this._rebuildLinkKeyMap();
  }

  // ============ 链接数据管理 ============

  get linkDataArray(): ObjectData[] {
    return this._linkDataArray;
  }
  set linkDataArray(val: ObjectData[]) {
    const old = this._linkDataArray;
    if (old === val) return;
    this._linkDataArray = val || [];
    this._linkKeyMap.clear();
    if (this.linkKeyProperty) {
      // 官方 GraphLinksModel.linkDataArray setter 的 key 补齐两趟
      //（与 Model.nodeDataArray 同构；makeLinkDataKeyUnique 亦为负数键）
      const rekey: ObjectData[] = [];
      for (const r of this._linkDataArray) {
        const l = this.getLinkKeyForData(r);
        if (l === undefined || this._linkKeyMap.has(l)) rekey.push(r);
        else this._linkKeyMap.add(l, r);
      }
      for (const o of rekey) {
        this.makeLinkDataKeyUnique(o);
        const l = this.getLinkKeyForData(o);
        if (l !== undefined) this._linkKeyMap.add(l, o);
      }
    }
    for (const ld of this._linkDataArray) this._ensureArchetypeNodesForLinkData(ld);
    this.raiseChangedEvent(ChangedEventProperty, this, 'linkDataArray', old, this._linkDataArray);
  }

  /**
   * 官方 `GraphLinksModel` 行为：link data 引用的节点 key 若不在 nodeDataArray 中，
   * 且设置了 archetypeNodeData，则复制 archetype 生成该 key 的节点数据并加入 nodeDataArray。
   */
  private _ensureArchetypeNodesForLinkData(data: ObjectData): void {
    const arch = this._archetypeNodeData;
    if (!arch || !data) return;
    const ensure = (key: any) => {
      if (key === undefined || key === null) return;
      if (this.findNodeDataForKey(key) !== null) return;
      const nd = this.copyNodeData(arch);
      this.setDataProperty(nd, this.nodeKeyProperty, key);
      this.addNodeData(nd);
    };
    if (this.linkFromKeyProperty) ensure(data[this.linkFromKeyProperty]);
    if (this.linkToKeyProperty) ensure(data[this.linkToKeyProperty]);
    const labels = this.getLabelKeysForLinkData(data);
    if (Array.isArray(labels)) for (const k of labels) ensure(k);
  }

  /** 添加链接数据 */
  addLinkData(data: ObjectData): void {
    if (!data) throw new Error('Cannot add null link data');
    if (this.isReadOnly) throw new Error('Model is read-only');
    if (this.containsLinkData(data)) return; // 官方 mv：重复添加直接 no-op
    this._linkDataArray.push(data);
    this._ensureArchetypeNodesForLinkData(data);
    if (this.linkKeyProperty) {
      // 官方 mv：key 缺失/重复 → makeLinkDataKeyUnique（负数键）后入 keyMap
      this.makeLinkDataKeyUnique(data);
      const key = this.getLinkKeyForData(data);
      if (key !== undefined) {
        this._linkKeyMap.add(key, data);
      }
    }
    this.raiseChangedEvent(ChangedEventInsert, this, 'linkDataArray', null, data, this._linkDataArray.length - 1);
  }

  /** 移除链接数据 */
  removeLinkData(data: ObjectData): boolean {
    if (!data) return false;
    if (this.isReadOnly) throw new Error('Model is read-only');
    const idx = this._linkDataArray.indexOf(data);
    if (idx < 0) return false;
    this._linkDataArray.splice(idx, 1);
    if (this.linkKeyProperty) {
      const key = this.getLinkKeyForData(data);
      if (key !== undefined) {
        this._linkKeyMap.remove(key);
      }
    }
    this.raiseChangedEvent(ChangedEventRemove, this, 'linkDataArray', data, null, idx);
    return true;
  }

  /** 是否包含链接数据 */
  containsLinkData(data: ObjectData): boolean {
    return this._linkDataArray.indexOf(data) >= 0;
  }

  /** 根据 key 查找链接数据（官方 findLinkDataForKey 返回 null） */
  findLinkDataForKey(key: any): ObjectData | null {
    return this._linkKeyMap.get(key);
  }

  /** 获取链接的 from key */
  getFromKeyForLinkData(data: ObjectData): any {
    if (!data) return undefined;
    return data[this.linkFromKeyProperty];
  }

  /** 设置链接的 from key */
  setFromKeyForLinkData(data: ObjectData, key: any): void {
    if (!data) return;
    this.setDataProperty(data, this.linkFromKeyProperty, key);
  }

  /** 获取链接的 to key */
  getToKeyForLinkData(data: ObjectData): any {
    if (!data) return undefined;
    return data[this.linkToKeyProperty];
  }

  /** 设置链接的 to key */
  setToKeyForLinkData(data: ObjectData, key: any): void {
    if (!data) return;
    this.setDataProperty(data, this.linkToKeyProperty, key);
  }

  /** 获取链接的 fromPort */
  getFromPortIdForLinkData(data: ObjectData): string {
    if (!data) return '';
    return data[this.linkFromPortIdProperty] || '';
  }

  /** 设置链接的 fromPort */
  setFromPortIdForLinkData(data: ObjectData, portId: string): void {
    if (!data) return;
    this.setDataProperty(data, this.linkFromPortIdProperty, portId);
  }

  /** 获取链接的 toPort */
  getToPortIdForLinkData(data: ObjectData): string {
    if (!data) return '';
    return data[this.linkToPortIdProperty] || '';
  }

  /** 设置链接的 toPort */
  setToPortIdForLinkData(data: ObjectData, portId: string): void {
    if (!data) return;
    this.setDataProperty(data, this.linkToPortIdProperty, portId);
  }

  /** 获取链接的标签 key 数组 */
  getLabelKeysForLinkData(data: ObjectData): any[] {
    if (!data || !this.linkLabelKeysProperty) return [];
    return data[this.linkLabelKeysProperty] || [];
  }

  /** 设置链接的标签 key 数组 */
  setLabelKeysForLinkData(data: ObjectData, keys: any[]): void {
    if (!data || !this.linkLabelKeysProperty) return;
    this.setDataProperty(data, this.linkLabelKeysProperty, keys);
  }

  /** 获取链接分类 */
  getCategoryForLinkData(data: ObjectData): string {
    if (!data) return '';
    return data[this.linkCategoryProperty] || '';
  }

  /** 设置链接分类 */
  setCategoryForLinkData(data: ObjectData, category: string): void {
    if (!data) return;
    this.setDataProperty(data, this.linkCategoryProperty, category);
  }

  /** 获取链接 key */
  getLinkKeyForData(data: ObjectData): any {
    if (!data || !this.linkKeyProperty) return undefined;
    return data[this.linkKeyProperty];
  }

  /** 设置链接 key */
  setLinkKeyForData(data: ObjectData, key: any): void {
    if (!data || !this.linkKeyProperty) return;
    this.setDataProperty(data, this.linkKeyProperty, key);
  }


  // ============ 官方 GraphLinksModel API 对齐（阶段 5） ============

  static readonly EmptyArray: readonly any[] = Object.freeze([]);

  private _archetypeNodeData: ObjectData | null = null;

  /** 官方 GraphLinksModel.archetypeNodeData */
  get archetypeNodeData(): ObjectData | null {
    return this._archetypeNodeData;
  }
  set archetypeNodeData(value: ObjectData | null) {
    if (this._archetypeNodeData === value) return;
    const old = this._archetypeNodeData;
    this._archetypeNodeData = value;
    this.raiseChanged('archetypeNodeData', old, value);
  }

  get type(): string {
    return 'GraphLinksModel';
  }

  /** 官方 GraphLinksModel.getKeyForLinkData */
  getKeyForLinkData(data: ObjectData): any {
    return this.getLinkKeyForData(data);
  }

  /** 官方 GraphLinksModel.setKeyForLinkData */
  setKeyForLinkData(data: ObjectData, key: any): void {
    if (data === null || data === undefined) return;
    if (key !== null && key !== undefined && !this.isKeyType(key)) {
      throw new Error('setKeyForLinkData:key must be a number or a string');
    }
    if (this.linkKeyProperty === '') return;
    if (!this.containsLinkData(data)) {
      this.setDataProperty(data, this.linkKeyProperty, key);
      return;
    }
    const old = this.getLinkKeyForData(data);
    if (old === key) return;
    if (this.findLinkDataForKey(key) !== null) return;
    this.setDataProperty(data, this.linkKeyProperty, key);
    if (old !== undefined) this._linkKeyMap.remove(old);
    this._linkKeyMap.add(key, data);
    this.raiseChangedEvent(ChangedEventProperty, data, this.linkKeyProperty, old, key);
    this.updateTargetBindings(this.linkKeyProperty);
  }

  /** 官方 GraphLinksModel.makeLinkDataKeyUnique */
  makeLinkDataKeyUnique(data: ObjectData): void {
    if (data === null || data === undefined) return;
    const prop = this.linkKeyProperty;
    if (prop === '') return;
    let key = this.getLinkKeyForData(data);
    if (key !== undefined && !this._linkKeyMap.has(key)) return;
    const fn = this.makeUniqueLinkKeyFunction;
    if (fn !== null) {
      key = fn(this, data);
      if (key !== null && key !== undefined && !this._linkKeyMap.has(key)) {
        this.setDataProperty(data, prop, key);
        return;
      }
    }
    if (typeof key === 'string') {
      let n = 2;
      while (this._linkKeyMap.has(key + n)) n++;
      this.setDataProperty(data, prop, key + n);
    } else if (key === undefined || typeof key === 'number') {
      let n = -this._linkKeyMap.count - 1;
      while (this._linkKeyMap.has(n)) n--;
      this.setDataProperty(data, prop, n);
    }
  }

  /** 官方 GraphLinksModel.addLabelKeyForLinkData */
  addLabelKeyForLinkData(linkdata: ObjectData, key: any): void {
    if (linkdata === undefined || linkdata === null) return;
    if (key === null || key === undefined) return;
    if (!this.isKeyType(key)) {
      throw new Error('addLabelKeyForLinkData:key must be a number or a string');
    }
    const prop = this.linkLabelKeysProperty;
    if (prop === '') return;
    const current = linkdata[prop];
    if (current === undefined) {
      this.setLabelKeysForLinkData(linkdata, [key]);
      return;
    }
    if (!Array.isArray(current)) {
      throw new Error(prop + ' property is not an Array; cannot addLabelKeyForLinkData: ' + linkdata);
    }
    if (current.indexOf(key) >= 0) return;
    const index = current.length;
    current.push(key);
    if (this.containsLinkData(linkdata)) {
      this.raiseChangedEvent(ChangedEventInsert, linkdata, prop, null, key, index);
    }
  }

  /** 官方 GraphLinksModel.removeLabelKeyForLinkData */
  removeLabelKeyForLinkData(linkdata: ObjectData, key: any): void {
    if (linkdata === undefined || linkdata === null) return;
    if (key === null || key === undefined) return;
    if (!this.isKeyType(key)) {
      throw new Error('removeLabelKeyForLinkData:key must be a number or a string');
    }
    const prop = this.linkLabelKeysProperty;
    if (prop === '') return;
    const current = linkdata[prop];
    if (current === undefined) return;
    if (!Array.isArray(current)) {
      throw new Error(prop + ' property is not an Array; cannot removeLabelKeyForLinkData: ' + linkdata);
    }
    const index = current.indexOf(key);
    if (index < 0) return;
    current.splice(index, 1);
    if (this.containsLinkData(linkdata)) {
      this.raiseChangedEvent(ChangedEventRemove, linkdata, prop, key, null, index);
    }
  }

  /** 官方 GraphLinksModel.addLinkDataCollection */
  addLinkDataCollection(coll: ObjectData[] | List<ObjectData>): void {
    const items = Array.isArray(coll) ? coll : coll.toArray();
    for (let i = 0; i < items.length; i++) this.addLinkData(items[i]);
  }

  /** 官方 GraphLinksModel.removeLinkDataCollection */
  removeLinkDataCollection(coll: ObjectData[] | List<ObjectData>): void {
    const items = Array.isArray(coll) ? coll : coll.toArray();
    for (let i = 0; i < items.length; i++) this.removeLinkData(items[i]);
  }

  /** 官方 GraphLinksModel.mergeLinkDataArray */
  mergeLinkDataArray(arr: ObjectData[]): void {
    if (arr === this.linkDataArray || !Array.isArray(arr)) return;
    const oldKeys = new Set<any>();
    const kit = this._linkKeyMap.iteratorKeys;
    while (kit.next()) oldKeys.add(kit.value);
    const seenKeys = new Set<any>();
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      const incoming = arr[i];
      const key = this.getLinkKeyForData(incoming);
      if (key !== undefined) {
        seenKeys.add(key);
        const existing = this.findLinkDataForKey(key);
        if (existing === incoming) continue;
        if (existing !== null) {
          this.assignAllDataProperties(existing, incoming);
          this._copyLinkDataProperties(incoming, existing);
        } else {
          const copy = this.cloneDeep(incoming);
          this.setKeyForLinkData(copy, key);
          this.addLinkData(copy);
        }
      } else {
        const copy = this.cloneDeep(incoming);
        this.addLinkData(copy);
        const newKey = this.getLinkKeyForData(copy);
        if (newKey !== undefined) seenKeys.add(newKey);
      }
    }
    const oit = oldKeys.iterator;
    while (oit.next()) {
      const key = oit.value;
      if (seenKeys.has(key)) continue;
      const data = this.findLinkDataForKey(key);
      if (data) this.removeLinkData(data);
    }
  }

  /** 官方 GraphLinksModel.copyLinkData */
  copyLinkData(data: ObjectData): ObjectData {
    let copy: any;
    const fn = this.copyLinkDataFunction;
    if (fn !== null) {
      copy = fn(data, this);
    } else {
      copy = this.cloneDeep(data);
    }
    if (copy !== null && typeof copy === 'object' && !Array.isArray(copy)) {
      if (this.linkFromKeyProperty !== '') this.setDataProperty(copy, this.linkFromKeyProperty, undefined);
      if (this.linkToKeyProperty !== '') this.setDataProperty(copy, this.linkToKeyProperty, undefined);
      if (this.linkLabelKeysProperty !== '') this.setDataProperty(copy, this.linkLabelKeysProperty, []);
    }
    return copy;
  }

  /** 官方 GraphLinksModel.isGroupForData */
  isGroupForData(data: ObjectData): boolean {
    return this.isGroupForNodeData(data);
  }

  /** 官方 GraphLinksModel.getGroupForData */
  getGroupForData(data: ObjectData): any {
    return this.getGroupKeyForNodeData(data);
  }

  /** 官方 GraphLinksModel.setGroupForData */
  setGroupForData(data: ObjectData, groupKey: any): void {
    this.setGroupKeyForNodeData(data, groupKey);
  }

  /** 官方 GraphLinksModel.getLinkCategoryForData */
  getLinkCategoryForData(data: ObjectData): string {
    return this.getCategoryForLinkData(data);
  }

  /** 官方 GraphLinksModel.setLinkCategoryForData */
  setLinkCategoryForData(data: ObjectData, cat: string): void {
    this.setCategoryForLinkData(data, cat);
  }

  protected copyCategory(from: ObjectData, to: ObjectData): void {
    super.copyCategory(from, to);
    this.setGroupKeyForNodeData(to, this.getGroupKeyForNodeData(from));
  }

  /** 官方 GraphLinksModel.zR：合并/复制链接数据时搬运各类属性 */
  private _copyLinkDataProperties(from: ObjectData, to: ObjectData): void {
    this.setCategoryForLinkData(to, this.getCategoryForLinkData(from));
    this.setFromKeyForLinkData(to, this.getFromKeyForLinkData(from));
    this.setToKeyForLinkData(to, this.getToKeyForLinkData(from));
    this.setLabelKeysForLinkData(to, this.getLabelKeysForLinkData(from));
    this.setFromPortIdForLinkData(to, this.getFromPortIdForLinkData(from));
    this.setToPortIdForLinkData(to, this.getToPortIdForLinkData(from));
  }


  toJson(_classname?: string): string {
    const data: any = {
      class: 'GraphLinksModel',
      nodeDataArray: this.nodeDataArray,
      linkDataArray: this._linkDataArray,
    };
    if (Object.keys(this.modelData).length > 0) {
      data.modelData = this.modelData;
    }
    return JSON.stringify(data, null, 2);
  }

  static fromJson(json: string | object): GraphLinksModel {
    // 与官方一致：子类不覆写反序列化语义，统一走 Model.fromJson 的类注册表
    return Model.fromJson(json) as GraphLinksModel;
  }

  // ============ 辅助方法 ============

  private _rebuildLinkKeyMap(): void {
    this._linkKeyMap.clear();
    if (!this.linkKeyProperty) return;
    for (const data of this._linkDataArray) {
      const key = this.getLinkKeyForData(data);
      if (key !== undefined) {
        this._linkKeyMap.add(key, data);
      }
    }
  }

  clear(): void {
    super.clear();
    this._linkDataArray.length = 0;
    this._linkKeyMap.clear();
  }

  copy(): GraphLinksModel {
    const m = new GraphLinksModel();
    this.cloneProtected(m);
    m.nodeDataArray = this.nodeDataArray.map(d => this.cloneDeep(d));
    m.linkDataArray = this._linkDataArray.map(d => this.cloneDeep(d));
    return m;
  }

  cloneProtected(copy: Model): void {
    super.cloneProtected(copy);
    const m = copy as GraphLinksModel;
    m.linkFromKeyProperty = this.linkFromKeyProperty;
    m.linkToKeyProperty = this.linkToKeyProperty;
    m.linkFromPortIdProperty = this.linkFromPortIdProperty;
    m.linkToPortIdProperty = this.linkToPortIdProperty;
    m.linkCategoryProperty = this.linkCategoryProperty;
    m.linkKeyProperty = this.linkKeyProperty;
    m.createMissingNodeData = this.createMissingNodeData;
  }
}

// 注册到 Model.fromJson 的类表（详见 Model.registerClass 注释）。
Model.registerClass('GraphLinksModel', GraphLinksModel, (m, d) => {
  const g = m as GraphLinksModel;
  if (d.linkDataArray) g.linkDataArray = d.linkDataArray;
  if (d.linkKeyProperty !== undefined) g.linkKeyProperty = d.linkKeyProperty;
  if (d.linkFromKeyProperty !== undefined) g.linkFromKeyProperty = d.linkFromKeyProperty;
  if (d.linkToKeyProperty !== undefined) g.linkToKeyProperty = d.linkToKeyProperty;
  if (d.linkFromPortIdProperty !== undefined) g.linkFromPortIdProperty = d.linkFromPortIdProperty;
  if (d.linkToPortIdProperty !== undefined) g.linkToPortIdProperty = d.linkToPortIdProperty;
  if (d.linkCategoryProperty !== undefined) g.linkCategoryProperty = d.linkCategoryProperty;
  if (d.archetypeNodeData !== undefined) g.archetypeNodeData = d.archetypeNodeData;
  if (d.archetypeLinkData !== undefined) (g as any).archetypeLinkData = d.archetypeLinkData;
  if (d.createMissingNodeData !== undefined) g.createMissingNodeData = d.createMissingNodeData;
});
