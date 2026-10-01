import { ChangedEvent } from './ChangedEvent';
import { UndoManager } from './UndoManager';
import { Transaction } from './Transaction';
import { Binding } from './Binding';
import { List } from '../core/List';
import { Map } from '../core/Map';
import { Set } from '../core/Set';
import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { Margin } from '../core/Margin';
import { Spot } from '../core/Spot';
import { Brush } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { EnumValue, BrushSolid, ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction } from '../core/EnumValues';

declare const require: any;

/**
 * ObjectData - 节点/链接数据对象类型
 */
export type ObjectData = Record<string, any>;

/**
 * ChangedEventListener - 变更事件监听器
 */
export type ChangedEventListener = (e: ChangedEvent) => void;

/**
 * IncrementalData - 官方 Model.toIncrementalData 的输出结构
 * 所有属性都是可选的，仅在发生了相应变更时出现
 */
export interface IncrementalData {
  modelData?: ObjectData;
  insertedNodeKeys?: any[];
  modifiedNodeData?: ObjectData[];
  removedNodeKeys?: any[];
  insertedLinkKeys?: any[];
  modifiedLinkData?: ObjectData[];
  removedLinkKeys?: any[];
}

/**
 * Model - 基础模型
 * 管理 nodeDataArray，支持数据绑定、事务和撤销/重做
 */
export class Model {
  static readonly className: string = "Model";
  /** 数据格式名称 */
  public dataFormat: string = 'gojs';
  /** 模型名称 */
  public name: string = '';
  /** 节点 key 属性名 */
  public nodeKeyProperty: string = 'key';
  /** 节点分类属性名 */
  public nodeCategoryProperty: string = 'category';
  /** 是否只读 */
  public isReadOnly: boolean = false;
  /** 复制时是否深拷贝数组中的对象 */
  public copiesArrayObjects: boolean = true;
  /** 复制时是否深拷贝数组 */
  public copiesArrays: boolean = false;
  /** 复制时是否保留 key */
  public copiesKey: boolean = true;
  /** 点坐标小数位数 */
  public pointsDigits: number = 2;
  /** 是否跳过撤销管理器 */
  public skipsUndoManager: boolean = false;
  /** 模型级别数据 */
  public modelData: ObjectData;
  /** 自定义 key 生成函数 */
  public makeUniqueKeyFunction: ((model: Model, data: ObjectData) => any) | null = null;
  /** 自定义节点数据复制函数 */
  public copyNodeDataFunction: ((data: ObjectData, model: Model) => ObjectData) | null = null;
  /** 节点是否为分组的属性名 */
  public nodeIsGroupProperty: string = 'isGroup';
  /** 节点所属分组 key 的属性名 */
  public nodeGroupKeyProperty: string = 'group';
  /** 链接标签 key 数组的属性名 */
  public linkLabelKeysProperty: string = '';
  /** 自定义链接 key 生成函数 */
  public makeUniqueLinkKeyFunction: ((model: Model, data: ObjectData) => any) | null = null;
  /** 自定义链接数据复制函数 */
  public copyLinkDataFunction: ((data: ObjectData, model: Model) => ObjectData) | null = null;

  private _nodeDataArray: ObjectData[] = [];
  private _undoManager: UndoManager;
  private _changedListeners: ChangedEventListener[] = [];
  private _keyMap: Map<any, ObjectData>;
  private _nextKey: number = 1;

  constructor();
  constructor(init: Partial<Model> | ObjectData[]);
  constructor(init?: Partial<Model> | ObjectData[]) {
    this._nodeDataArray = Array.isArray(init) ? init : [];
    this._undoManager = new UndoManager();
    this._undoManager.model = this;
    this._keyMap = new Map<any, ObjectData>();
    this.modelData = {};
    if (init && !Array.isArray(init)) {
      this.set(init);
    }
    this._rebuildKeyMap();
  }

  // ============ 节点数据管理 ============

  get nodeDataArray(): ObjectData[] {
    return this._nodeDataArray;
  }
  set nodeDataArray(val: ObjectData[]) {
    const old = this._nodeDataArray;
    if (old === val) return;
    this._nodeDataArray = val || [];
    this._rebuildKeyMap();
    // 官方 Model.nodeDataArray setter：发出 Set 变更（modelChange="nodeDataArray"），
    // Diagram 据此移除旧数组数据的 Parts 并为新数组数据创建 Parts
    this.raiseChangedEvent(ChangedEventProperty, this, 'nodeDataArray', old, this._nodeDataArray);
  }

  /** 添加节点数据 */
  addNodeData(data: ObjectData): void {
    if (!data) throw new Error('Cannot add null node data');
    if (this.isReadOnly) throw new Error('Model is read-only');
    this.ensureUniqueKey(data);
    this._nodeDataArray.push(data);
    this._keyMap.add(this.getKeyForNodeData(data), data);
    this.raiseChangedEvent(ChangedEventInsert, this, 'nodeDataArray', null, data, this._nodeDataArray.length - 1);
  }

  /** 添加节点数据集合 */
  addNodeDataCollection(coll: ObjectData[] | List<ObjectData>): void {
    const items = Array.isArray(coll) ? coll : coll.toArray();
    for (const data of items) {
      this.addNodeData(data);
    }
  }

  /** 移除节点数据 */
  removeNodeData(data: ObjectData): boolean {
    if (!data) return false;
    if (this.isReadOnly) throw new Error('Model is read-only');
    const idx = this._nodeDataArray.indexOf(data);
    if (idx < 0) return false;
    this._nodeDataArray.splice(idx, 1);
    this._keyMap.remove(this.getKeyForNodeData(data));
    this.raiseChangedEvent(ChangedEventRemove, this, 'nodeDataArray', data, null, idx);
    return true;
  }

  /** 移除节点数据集合 */
  removeNodeDataCollection(coll: ObjectData[] | List<ObjectData>): void {
    const items = Array.isArray(coll) ? coll : coll.toArray();
    for (const data of items) {
      this.removeNodeData(data);
    }
  }

  /** 是否包含节点数据 */
  containsNodeData(data: ObjectData): boolean {
    return this._nodeDataArray.indexOf(data) >= 0;
  }

  /** 根据 key 查找节点数据 */
  findNodeDataForKey(key: any): ObjectData | null {
    return this._keyMap.get(key) ?? null;
  }

  /** 获取节点的 key */
  getKeyForNodeData(data: ObjectData): any {
    if (!data) return undefined;
    const prop = this.nodeKeyProperty;
    if (typeof prop === 'function') {
      return (prop as (data: ObjectData) => any)(data);
    }
    return data[prop];
  }

  /** 设置节点的 key */
  setKeyForNodeData(data: ObjectData, key: any): void {
    if (!data) return;
    const oldKey = this.getKeyForNodeData(data);
    if (oldKey === key) return;
    this._keyMap.remove(oldKey);
    const prop = this.nodeKeyProperty;
    if (typeof prop === 'string') {
      this.setDataProperty(data, prop, key);
    }
    this._keyMap.add(key, data);
  }

  /** 获取节点的分类 */
  getCategoryForNodeData(data: ObjectData): string {
    if (!data) return '';
    const prop = this.nodeCategoryProperty;
    if (typeof prop === 'function') {
      return (prop as (data: ObjectData) => string)(data) || '';
    }
    return data[prop] || '';
  }

  /** 设置节点的分类 */
  setCategoryForNodeData(data: ObjectData, category: string): void {
    if (!data) return;
    const prop = this.nodeCategoryProperty;
    if (typeof prop === 'string') {
      this.setDataProperty(data, prop, category);
    }
  }

  /** 判断节点是否为分组 */
  isGroupForNodeData(data: ObjectData): boolean {
    if (!data) return false;
    const prop = this.nodeIsGroupProperty;
    if (typeof prop === 'function') {
      return (prop as (data: ObjectData) => boolean)(data);
    }
    return !!data[prop];
  }

  /** 设置节点是否为分组 */
  setIsGroupForNodeData(data: ObjectData, flag: boolean): void {
    if (!data) return;
    const prop = this.nodeIsGroupProperty;
    if (typeof prop === 'string') {
      this.setDataProperty(data, prop, flag);
    }
  }

  /** 获取节点的分组 key */
  getGroupKeyForNodeData(data: ObjectData): any {
    if (!data) return undefined;
    const prop = this.nodeGroupKeyProperty;
    if (typeof prop === 'function') {
      return (prop as (data: ObjectData) => any)(data);
    }
    return data[prop];
  }

  /** 设置节点的分组 key */
  setGroupKeyForNodeData(data: ObjectData, key: any): void {
    if (!data) return;
    const prop = this.nodeGroupKeyProperty;
    if (typeof prop === 'string') {
      this.setDataProperty(data, prop, key);
    }
  }

  /** 获取 modelData 中的属性 */
  getModelData(key: string): any {
    return this.modelData[key];
  }

  /** 设置 modelData 中的属性（支持撤销） */
  setModelData(key: string, value: any): void {
    if (this.isReadOnly) throw new Error('Model is read-only');
    const old = this.modelData[key];
    if (old === value) return;
    this.modelData[key] = value;
    this.raiseChangedEvent(ChangedEventProperty, this, 'modelData.' + key, old, value);
  }

  /** 设置数据属性（支持撤销） */
  setDataProperty(data: ObjectData, propname: string, value: any): void {
    if (!data) return;
    if (this.isReadOnly) throw new Error('Model is read-only');
    const old = data[propname];
    if (old === value) return;
    data[propname] = value;
    this.raiseChangedEvent(ChangedEventProperty, data, propname, old, value);
    this.updateTargetBindings(propname);
  }

  /** 向数组添加项 */
  addArrayItem(arr: any[], item: any): void {
    if (!arr) return;
    arr.push(item);
    this.raiseChangedEvent(ChangedEventInsert, arr, '', null, item, arr.length - 1);
  }

  /** 在数组指定位置插入项 */
  insertArrayItem(arr: any[], index: number, item: any): void {
    if (!arr) return;
    arr.splice(index, 0, item);
    this.raiseChangedEvent(ChangedEventInsert, arr, '', null, item, index);
  }

  /** 移除数组项 */
  removeArrayItem(arr: any[], index?: number): void {
    if (!arr) return;
    if (index === undefined) {
      index = arr.length - 1;
    }
    const old = arr[index];
    arr.splice(index, 1);
    this.raiseChangedEvent(ChangedEventRemove, arr, '', old, null, index);
  }

  /** 确保 key 唯一 */
  ensureUniqueKey(data: ObjectData): void {
    if (this.makeUniqueKeyFunction) {
      this.makeUniqueKeyFunction(this, data);
      return;
    }
    const key = this.getKeyForNodeData(data);
    if (key === undefined || this._keyMap.contains(key)) {
      let newKey = this._nextKey++;
      while (this._keyMap.contains(newKey)) {
        newKey = this._nextKey++;
      }
      const prop = this.nodeKeyProperty;
      if (typeof prop === 'string') {
        data[prop] = newKey;
      }
    }
  }

  /** 复制节点数据 */
  copyNodeData(data: ObjectData): ObjectData {
    if (this.copyNodeDataFunction) {
      return this.copyNodeDataFunction(data, this);
    }
    return this.cloneDeep(data);
  }

  /** 深度克隆 */
  cloneDeep(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (this.copiesArrayObjects && typeof item === 'object' && item !== null) {
          return this.cloneDeep(item);
        }
        return item;
      });
    }
    const copy: ObjectData = {};
    for (const key of Object.keys(obj)) {
      let val = obj[key];
      if (Array.isArray(val)) {
        if (this.copiesArrays) {
          val = this.cloneDeep(val);
        }
      } else if (typeof val === 'object' && val !== null) {
        val = this.cloneDeep(val);
      }
      copy[key] = val;
    }
    return copy;
  }

  // ============ 事务管理 ============

  get undoManager(): UndoManager {
    return this._undoManager;
  }

  startTransaction(tname: string = ''): boolean {
    return this._undoManager.startTransaction(tname);
  }

  commitTransaction(tname: string = ''): boolean {
    return this._undoManager.commitTransaction(tname);
  }

  rollbackTransaction(): boolean {
    return this._undoManager.rollbackTransaction();
  }

  /** 在事务中执行函数 */
  commit(func: (owner?: any) => any, tname: string = 'commit'): any {
    this.startTransaction(tname);
    let result: any;
    let ok = false;
    try {
      result = func(this);
      ok = true;
    } finally {
      if (ok) this.commitTransaction(tname);
      else this.rollbackTransaction();
    }
    return result;
  }

  // ============ 变更事件 ============

  addChangedListener(listener: ChangedEventListener): void {
    this._changedListeners.push(listener);
  }

  removeChangedListener(listener: ChangedEventListener): void {
    const idx = this._changedListeners.indexOf(listener);
    if (idx >= 0) this._changedListeners.splice(idx, 1);
  }

  raiseChangedEvent(change: any, object: any, propertyName: string, oldValue: any, newValue: any, index?: number): ChangedEvent {
    const e = new ChangedEvent(change, object, propertyName, oldValue, newValue, index);
    e.isModelChange = true;
    e.model = this;
    if (!e.isTransactionChange && !this.skipsUndoManager) {
      this._undoManager.handleChanged(e);
    }
    for (const listener of this._changedListeners) {
      listener(e);
    }
    return e;
  }

  raiseTransactionEvent(propertyName: string, tname: string, transObj?: any): ChangedEvent {
    const e = new ChangedEvent(ChangedEventTransaction, this, propertyName, tname, transObj);
    e.isModelChange = true;
    e.model = this;
    e.transactionName = tname;
    for (const listener of this._changedListeners) {
      listener(e);
    }
    return e;
  }

  /** 更新目标绑定 */
  updateTargetBindings(propname?: string): void {
    // 由 Diagram 实现
  }

  // ============ 序列化 ============

  /** 序列化为 JSON */
  toJson(_classname?: string): string {
    const data: any = {
      class: 'Model',
      nodeDataArray: this._nodeDataArray,
    };
    if (Object.keys(this.modelData).length > 0) {
      data.modelData = this.modelData;
    }
    return JSON.stringify(data, null, 2);
  }

  /**
   * `toJson()` 写出的 `class` 名 → `{ ctor, apply }` 的注册表。
   * 官方靠内部注册表解析；这里由各子类在模块求值时自注册，
   * 避免在 `Model.ts` 里 `require('./GraphLinksModel')` —— 那是 CommonJS
   * 调用，在浏览器 bundle 里会抛 `require is not defined`，
   * 导致所有走 `Model.fromJson()` 的样例直接崩（实测 13 个）。
   */
  private static readonly _ctors: Record<string, {
    ctor: new () => Model;
    apply?: (m: Model, data: any) => void;
  }> = {};

  /**
   * 由子类模块在顶层调用：
   *   `Model.registerClass('TreeModel', TreeModel, (m, d) => { ... })`
   * `apply` 只负责该子类**自己**的额外字段；公共字段由 `fromJson` 统一处理。
   */
  static registerClass(
    name: string,
    ctor: new () => Model,
    apply?: (m: Model, data: any) => void
  ): void {
    Model._ctors[name] = { ctor, apply };
  }

  /**
   * 解析 `class` 字段 → 构造器 + `apply`。
   * 对齐官方 `Model.I3()`（`node_modules/gojs/release/go.js`）：
   *  - `go.Xxx` → 只查内部注册表（去掉 `go.` 前缀）
   *  - `Xxx`    → 先查内部注册表，查不到再查全局 `globalThis.Xxx`
   *  - 只有"可构造的函数"才会被采用，否则返回 null
   */
  private static _resolveClass(name: string): { ctor?: new () => Model; apply?: (m: Model, d: any) => void } | null {
    let rec: { ctor?: new () => Model; apply?: (m: Model, d: any) => void } | null = null;
    if (name.indexOf('go.') === 0) {
      rec = Model._ctors[name.substring(3)] ?? null;
    } else {
      rec = Model._ctors[name] ?? null;
      if (rec === null) {
        const g = (globalThis as any)[name];
        if (typeof g === 'function') rec = { ctor: g as new () => Model };
      }
    }
    if (rec !== null && typeof rec.ctor !== 'function') return null;
    return rec;
  }

  /**
   * 从 JSON 反序列化。
   * 语义对齐官方 `Model.fromJson(t, e)`（见 `node_modules/gojs/release/go.js`）：
   *  - 字符串 → `JSON.parse`，**解析失败静默降级为 null**（官方用 try/catch 吞掉）
   *  - 非字符串非对象 → 抛 `Unable to construct a Model from: <t>`
   *  - `class` 未注册 → 回落到普通 `Model`（官方 `I3()` 返回 null 后走 `Mv()`）
   */
  static fromJson(json: string | object, target?: Model): Model {
    let data: any = null;
    if (typeof json === 'string') {
      try { data = JSON.parse(json); } catch { data = null; }
    } else if (json !== null && typeof json === 'object') {
      data = json;
    } else {
      throw new Error('Unable to construct a Model from: ' + json);
    }

    const hasData = !!(data && typeof data === 'object');
    const cls = hasData && typeof data.class === 'string' ? data.class as string : undefined;
    let rec: { ctor?: new () => Model; apply?: (m: Model, d: any) => void } | null = null;
    if (cls !== undefined) {
      try { rec = Model._resolveClass(cls); } catch { rec = null; }
    }

    let model: Model | null = target !== undefined && target !== null ? target : null;
    if (!model) {
      model = rec !== null && rec.ctor !== undefined ? new rec.ctor() : new Model();
    }
    if (hasData) {
      if (data.nodeDataArray) model.nodeDataArray = data.nodeDataArray;
      if (data.modelData) model.modelData = data.modelData;
      if (data.nodeKeyProperty !== undefined) model.nodeKeyProperty = data.nodeKeyProperty;
      if (data.nodeCategoryProperty !== undefined) model.nodeCategoryProperty = data.nodeCategoryProperty;
      if (rec !== null && rec.apply) rec.apply(model, data);
    }
    return model;
  }

  static fromJSON(json: string | object): Model {
    return Model.fromJson(json);
  }

  // ============ 官方 Model API 对齐（阶段 5） ============

  private _afterCopyFunction: ((map: Map<any, any>, destModel: Model, srcModel: Model) => void) | null = null;

  get afterCopyFunction(): ((map: Map<any, any>, destModel: Model, srcModel: Model) => void) | null {
    return this._afterCopyFunction;
  }

  set afterCopyFunction(value: ((map: Map<any, any>, destModel: Model, srcModel: Model) => void) | null) {
    if (this._afterCopyFunction === value) return;
    const old = this._afterCopyFunction;
    this._afterCopyFunction = value;
    this.raiseChanged('afterCopyFunction', old, value);
  }

  /** 官方 Model.type：序列化时使用的类名 */
  get type(): string {
    return 'Model';
  }

  /** 官方 Model.toString(level)：level>1 返回 JSON，level>0 附带节点数据摘要 */
  toString(level?: number): string {
    let lv = level;
    if (lv === undefined) lv = 0;
    if (lv > 1) return this.toJson();
    let str = (this.name !== '' ? this.name : '') + ' Model';
    if (lv > 0) {
      str += '\n node data:';
      const arr = this._nodeDataArray;
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        str += ' ' + this.getKeyForNodeData(arr[i]) + ':' + Model._stringify(arr[i]);
      }
    }
    return str;
  }

  /** 官方 Model.isKeyType：只有 number/string 才能作为 key */
  isKeyType(key: any): boolean {
    return typeof key === 'number' || typeof key === 'string';
  }

  /** 官方 Model.raiseChanged：object 恒为 Model 自身 */
  raiseChanged(propertyName: string, oldValue: any, newValue: any, oldParam?: any, newParam?: any): void {
    this._raiseModelEvent('', ChangedEventProperty, propertyName, this, oldValue, newValue, oldParam, newParam);
  }

  /** 官方 Model.raiseDataChanged：object 为发生变更的那份数据对象 */
  raiseDataChanged(
    data: ObjectData,
    propertyname: string,
    oldval: any,
    newval: any,
    oldparam?: any,
    newparam?: any
  ): void {
    this._raiseModelEvent('', ChangedEventProperty, propertyname, data, oldval, newval, oldparam, newparam);
  }

  /** 官方 Model.changeState：由 UndoManager 正放/倒放一条变更 */
  changeState(e: ChangedEvent, undo: boolean): void {
    if (e === null || e === undefined || e.model !== this) return;
    if (e.change === ChangedEventProperty) {
      const obj = e.object;
      const prop = e.propertyName;
      const value = undo ? e.oldValue : e.newValue;
      if (obj !== null && prop === this.nodeKeyProperty && this.containsNodeData(obj)) {
        const gone = undo ? e.newValue : e.oldValue;
        const fresh = undo ? e.oldValue : e.newValue;
        if (gone !== undefined) this._keyMap.remove(gone);
        if (fresh !== undefined) this._keyMap.add(fresh, obj);
      }
      if (obj !== null && typeof obj === 'object') {
        if (value === undefined) {
          delete obj[prop];
        } else {
          obj[prop] = value;
        }
        this.updateTargetBindings(prop);
      }
    } else if (e.change === ChangedEventInsert) {
      if (undo) {
        this._detachNodeData(e.newValue, e.index);
      } else {
        this._attachNodeData(e.newValue, e.index);
      }
    } else if (e.change === ChangedEventRemove) {
      if (undo) {
        this._attachNodeData(e.oldValue, e.index);
      } else {
        this._detachNodeData(e.oldValue, e.index);
      }
    }
  }

  /** 官方 Model.makeNodeDataKeyUnique */
  makeNodeDataKeyUnique(nodedata: ObjectData): void {
    if (nodedata === null || nodedata === undefined) return;
    const prop = this.nodeKeyProperty;
    if (prop === '') return;
    let key = this.getKeyForNodeData(nodedata);
    if (key !== undefined && !this._keyMap.has(key)) return;
    const fn = this.makeUniqueKeyFunction;
    if (fn !== null) {
      key = fn(this, nodedata);
      if (key !== null && key !== undefined && !this._keyMap.has(key)) {
        this.setDataProperty(nodedata, prop, key);
        return;
      }
    }
    if (typeof key === 'string') {
      let n = 2;
      while (this._keyMap.has(key + n)) n++;
      this.setDataProperty(nodedata, prop, key + n);
    } else if (key === undefined || typeof key === 'number') {
      let n = -this._keyMap.count - 1;
      while (this._keyMap.has(n)) n--;
      this.setDataProperty(nodedata, prop, n);
    }
  }

  /** 官方 Model.mergeNodeDataArray：按 key 合并一份数据进来 */
  mergeNodeDataArray(arr: ObjectData[]): void {
    if (arr === this._nodeDataArray || !Array.isArray(arr)) return;
    const oldKeys = new Set<any>();
    const kit = this._keyMap.iteratorKeys;
    while (kit.next()) oldKeys.add(kit.value);
    const seenKeys = new Set<any>();
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      const incoming = arr[i];
      const key = this.getKeyForNodeData(incoming);
      if (key !== undefined) {
        seenKeys.add(key);
        const existing = this.findNodeDataForKey(key);
        if (existing === incoming) continue;
        if (existing !== null) {
          this.assignAllDataProperties(existing, incoming);
          this.copyCategory(incoming, existing);
        } else {
          const copy = this.cloneDeep(incoming);
          this.setKeyForNodeData(copy, key);
          this.addNodeData(copy);
        }
      } else {
        const copy = this.cloneDeep(incoming);
        this.addNodeData(copy);
        const newKey = this.getKeyForNodeData(copy);
        if (newKey !== undefined) seenKeys.add(newKey);
      }
    }
    const oit = oldKeys.iterator;
    while (oit.next()) {
      const key = oit.value;
      if (seenKeys.has(key)) continue;
      const data = this.findNodeDataForKey(key);
      if (data) this.removeNodeData(data);
    }
  }

  /** 官方 Model.assignAllDataProperties */
  assignAllDataProperties(data: ObjectData, props: ObjectData): void {
    if (!props) return;
    const inModel = this.containsNodeData(data);
    for (const key in props) {
      if (key === '__gohashid') continue;
      if (inModel && key === this.nodeKeyProperty) continue;
      this.setDataProperty(data, key, props[key]);
    }
  }

  /** 官方 Model.quote：把 charCode >= 127 的字符转成 \\uXXXX */
  quote(val: any): string {
    return Model._escapeNonAscii(JSON.stringify(val));
  }

  /** 官方 Model.toJSON */
  toJSON(classname?: string): string {
    return this.toJson(classname);
  }

  /** 官方 Model.toIncrementalData */
  toIncrementalData(e: ChangedEvent): IncrementalData | null {
    if (e === null || e === undefined) return null;
    if (e.change !== ChangedEventTransaction) {
      throw new Error('Model.toIncrementalData argument is not a Transaction ChangedEvent:' + e.toString());
    }
    const trans = e.object;
    if (!e.isTransactionFinished || !(trans instanceof Transaction)) return null;
    const shared = this._sharedPartData(trans);
    const parts = this._collectIncremental(trans, shared);
    const undo = e.propertyName === 'FinishedUndo';
    if (parts.empty) return null;
    const result: IncrementalData = {};
    if (parts.modelDataChanged) result.modelData = this.cloneDeep(this.modelData);
    if (parts.insertedKeys.length > 0) {
      if (undo) result.removedNodeKeys = parts.insertedKeys;
      else result.insertedNodeKeys = parts.insertedKeys;
    }
    if (parts.modifiedData.length > 0) result.modifiedNodeData = parts.modifiedData;
    if (parts.removedKeys.length > 0) {
      if (undo) result.insertedNodeKeys = parts.removedKeys;
      else result.removedNodeKeys = parts.removedKeys;
    }
    return result;
  }

  /** 官方 Model.toIncrementalJson */
  toIncrementalJson(e: ChangedEvent, classname?: string): string {
    if (e === null || e === undefined) return '{ "incremental": 0 }';
    if (e.change !== ChangedEventTransaction) {
      throw new Error('Model.toIncrementalJson argument is not a Transaction ChangedEvent:' + e.toString());
    }
    const trans = e.object;
    if (!e.isTransactionFinished || !(trans instanceof Transaction)) return '{ "incremental": 0 }';
    const cls = classname === undefined ? this.type : classname;
    const shared = this._sharedPartData(trans);
    const parts = this._collectIncremental(trans, shared);
    const undo = e.propertyName === 'FinishedUndo';
    let body = '';
    if (parts.modelDataChanged) body += ',\n  "modelData": ' + this._writeJsonObject(this.modelData);
    if (parts.insertedKeys.length > 0) {
      body += (undo ? ',\n  "removedNodeKeys": ' : ',\n  "insertedNodeKeys": ') + this._writeArray(parts.insertedKeys, true);
    }
    if (parts.modifiedData.length > 0) body += ',\n  "modifiedNodeData": ' + this._writeArray(parts.modifiedData, true);
    if (parts.removedKeys.length > 0) {
      body += (undo ? ',\n  "insertedNodeKeys": ' : ',\n  "removedNodeKeys": ') + this._writeArray(parts.removedKeys, true);
    }
    return '{ "class": ' + this.quote(cls) + ', "incremental": 1' + this._modelPropsJson() + body + '}';
  }

  /** 官方 Model.toIncrementalJSON */
  toIncrementalJSON(e: ChangedEvent, classname?: string): string {
    return this.toIncrementalJson(e, classname);
  }

  /** 官方 Model.applyIncrementalJson */
  applyIncrementalJson(s: string | ObjectData): void {
    let obj: any = null;
    if (typeof s === 'string') {
      try {
        obj = JSON.parse(s);
      } catch (err) {
        obj = null;
      }
    } else if (s !== null && typeof s === 'object') {
      obj = s;
    }
    if (obj === null || typeof obj !== 'object') {
      throw new Error('Unable to modify a Model from: ' + String(s));
    }
    const inc = obj.incremental;
    if (typeof inc !== 'number') {
      throw new Error('Unable to apply non-incremental changes to Model: ' + String(s));
    }
    if (inc === 0) return;
    this.startTransaction('applyIncrementalJson');
    this._applyIncremental(obj);
    this.commitTransaction('applyIncrementalJson');
  }

  /** 官方 Model.applyIncrementalJSON */
  applyIncrementalJSON(s: string | ObjectData): void {
    this.applyIncrementalJson(s);
  }

  /** 官方 Model.replaceJsonObjects：就地把 JSON 里的 {class:"go.*"} 换回真实对象 */
  replaceJsonObjects(t: any): any {
    if (Array.isArray(t)) {
      const n = t.length;
      for (let i = 0; i < n; i++) {
        const v = t[i];
        if (v !== null && typeof v === 'object') {
          t[i] = this.replaceJsonObjects(v);
        }
      }
    } else if (t !== null && typeof t === 'object') {
      for (const k in t) {
        const v = t[k];
        if (v !== null && typeof v === 'object') {
          const nv = this.replaceJsonObjects(v);
          t[k] = nv;
          this.replaceJsonPropertyValue(t, k, nv);
        }
      }
      return this._restoreJsonValue(t);
    }
    return t;
  }

  /** 官方 Model.replaceJsonPropertyValue：points 数字数组 -> List of Point */
  replaceJsonPropertyValue(x: ObjectData, p: string, replaced: any): void {
    if (p === 'points' && Array.isArray(replaced)) {
      let ok = replaced.length % 2 === 0;
      for (let i = 0; i < replaced.length; i++) {
        if (typeof replaced[i] !== 'number') {
          ok = false;
          break;
        }
      }
      if (ok) {
        const list = new List<Point>();
        const n = replaced.length / 2;
        for (let i = 0; i < n; i++) list.add(new Point(replaced[i * 2], replaced[i * 2 + 1]));
        x[p] = list;
      }
    }
  }

  /** 官方 Model.writeJsonValue */
  writeJsonValue(t: any): string {
    if (t === undefined) return 'undefined';
    if (t === null) return 'null';
    if (t === true) return 'true';
    if (t === false) return 'false';
    const typ = typeof t;
    if (typ === 'string') return this.quote(t);
    if (typ === 'number') {
      if (t === Infinity) return '9e9999';
      if (t === -Infinity) return '-9e9999';
      if (isNaN(t as number)) return '{"class":"NaN"}';
      return (t as number).toString();
    }
    if (t instanceof Boolean || t instanceof String || t instanceof Number) {
      return this.writeJsonValue((t as any).valueOf());
    }
    if (t instanceof Date) return '{"class":"Date", "value":"' + t.toJSON() + '"}';
    if (Array.isArray(t)) return this._writeArray(t);
    if (typ === 'object') return this._writeJsonObject(t);
    if (typ === 'function') return 'null';
    return '"' + t.toString() + '"';
  }

  /** 官方 Model.writeJsonPropertyValue */
  writeJsonPropertyValue(p: string, v: any): string {
    if (p === 'points' && v instanceof List) {
      const list = v as List<Point>;
      let s = '[';
      const it = list.iterator;
      while (it.next()) {
        const pt = it.value;
        if (s.length > 1) s += ',';
        s += this._roundPoints(pt.x);
        s += ',';
        s += this._roundPoints(pt.y);
      }
      return s + ']';
    }
    return this.writeJsonValue(v);
  }

  /** 官方 cloneProtected 需要一并复制的分类属性 */
  protected copyCategory(from: ObjectData, to: ObjectData): void {
    this.setCategoryForNodeData(to, this.getCategoryForNodeData(from));
  }

  // ---- Model 私有助手 ----

  private static _stringify(v: any): string {
    return v === undefined ? 'undefined' : v === null ? 'null' : v.toString();
  }

  private static _escapeNonAscii(s: string): string {
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code >= 127) {
        const hex = '0000' + code.toString(16);
        out += '\\u' + hex.substring(hex.length - 4);
      } else {
        out += s.charAt(i);
      }
    }
    return out;
  }

  private static _skipProperty(v: any, k: string): boolean {
    return v === undefined || k === '__gohashid' || k.charAt(0) === '_' || typeof v === 'function';
  }

  private static _isPlainObject(v: any): boolean {
    return v !== null && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype;
  }

  /** 官方 Model.FA：数据里不该出现的 Diagram/Part 引用 */
  private _isDiagramReference(v: any): boolean {
    if (v === null || typeof v !== 'object') return false;
    if (v instanceof Model || v instanceof UndoManager || v instanceof Transaction || v instanceof ChangedEvent) return true;
    const ctor = v.constructor;
    if (!ctor) return false;
    const name = ctor.className || '';
    if (name === 'Layer' || name === 'RowColumnDefinition') return true;
    if (name.indexOf('Animation') >= 0) return true;
    if (name.indexOf('Tool') >= 0) return true;
    if (name.indexOf('CommandHandler') >= 0) return true;
    if (name.indexOf('Layout') >= 0) return true;
    if (name.indexOf('Diagram') >= 0) return true;
    if (name.indexOf('Panel') >= 0) return true;
    if (name.indexOf('Part') >= 0) return true;
    if (name.indexOf('Node') >= 0) return true;
    if (name.indexOf('Link') >= 0) return true;
    if (name.indexOf('Group') >= 0) return true;
    if (name.indexOf('GraphObject') >= 0) return true;
    return false;
  }

  private _raiseModelEvent(
    modelChange: string,
    change: EnumValue,
    propertyName: string,
    object: any,
    oldValue: any,
    newValue: any,
    oldParam?: any,
    newParam?: any
  ): void {
    const e = new ChangedEvent(change, object, propertyName, oldValue, newValue);
    e.model = this;
    e.isModelChange = true;
    e.oldParam = oldParam === undefined ? null : oldParam;
    e.newParam = newParam === undefined ? null : newParam;
    if (!e.isTransactionChange && !this.skipsUndoManager) this._undoManager.handleChanged(e);
    const listeners = this._changedListeners;
    for (let i = 0; i < listeners.length; i++) listeners[i](e);
  }

  private _attachNodeData(data: ObjectData, index: number): void {
    if (data === null || data === undefined) return;
    if (this._nodeDataArray.indexOf(data) >= 0) return;
    const at = index === undefined || index === null ? -1 : index;
    if (at >= 0 && at < this._nodeDataArray.length) this._nodeDataArray.splice(at, 0, data);
    else this._nodeDataArray.push(data);
    const key = this.getKeyForNodeData(data);
    if (key !== undefined) this._keyMap.add(key, data);
  }

  private _detachNodeData(data: ObjectData, index: number): void {
    if (data === null || data === undefined) return;
    const at = this._nodeDataArray.indexOf(data);
    if (at < 0) return;
    this._nodeDataArray.splice(at, 1);
    const key = this.getKeyForNodeData(data);
    if (key !== undefined) this._keyMap.remove(key);
  }

  private _sharedPartData(t: Transaction): Map<any, any> {
    const result = new Map<any, any>();
    const link = (dataArray: any, part: any): void => {
      if (!part) return;
      const pd = part.data;
      if (!pd || pd === dataArray) return;
      let bucket = result.get(dataArray);
      if (bucket === null) {
        bucket = new Set<any>();
        bucket.add(pd);
        result.add(dataArray, bucket);
      } else {
        bucket.add(pd);
      }
    };
    const changes = t.changes;
    for (let i = 0; i < changes.length; i++) {
      const e = changes[i];
      if (e.diagram === null || e.diagram === undefined) continue;
      if (e.change === ChangedEventProperty) {
        if (e.object !== null && e.object.panel) link(e.object.panel.data, e.object.panel);
      } else if (e.change === ChangedEventInsert || e.change === ChangedEventRemove) {
        const panel = e.object;
        if (panel && panel.itemArray) link(panel.itemArray, panel);
      }
    }
    return result;
  }

  /** 官方 Model.MR：找出引用了 target 的那些节点数据 */
  private _referencedNodeData(target: any): Set<any> {
    const found = new Set<any>();
    const arr = this._nodeDataArray;
    for (let i = 0; i < arr.length; i++) {
      this._findReference(target, arr[i], arr[i], found);
    }
    return found;
  }

  private _findReference(target: any, current: any, owner: any, found: Set<any>): boolean {
    if (Array.isArray(current)) {
      const n = current.length;
      for (let i = 0; i < n; i++) {
        if (current[i] === target) {
          found.add(owner);
          return true;
        }
        if (this._findReference(target, current[i], owner, found)) return true;
      }
    } else if (Model._isPlainObject(current)) {
      for (const k in current) {
        const v = current[k];
        if (v === target) {
          found.add(owner);
          return true;
        }
        if (this._findReference(target, v, owner, found)) return true;
      }
    }
    return false;
  }

  private _collectIncremental(
    t: Transaction,
    shared: Map<any, any>
  ): {
    modelDataChanged: boolean;
    insertedKeys: any[];
    modifiedData: ObjectData[];
    removedKeys: any[];
    empty: boolean;
  } {
    let modelDataChanged = false;
    const inserts = new Set<ObjectData>();
    const modified = new Set<ObjectData>();
    const removes = new Set<ObjectData>();
    const changes = t.changes;
    for (let i = 0; i < changes.length; i++) {
      const e = changes[i];
      if (e.model !== this) continue;
      if (e.object === this && e.propertyName === 'nodeDataArray') {
        if (e.change === ChangedEventInsert) inserts.add(e.newValue);
        else if (e.change === ChangedEventRemove) removes.add(e.oldValue);
      } else if (e.object !== null && this.containsNodeData(e.object)) {
        modified.add(e.object);
      } else if (
        e.change === ChangedEventProperty &&
        (this.modelData === e.object || e.propertyName === 'modelData')
      ) {
        modelDataChanged = true;
      } else if (e.object !== null) {
        if (e.object instanceof Model) continue;
        if (shared.has(e.object)) {
          const bucket = shared.get(e.object);
          if (bucket !== null) {
            const bit = bucket.iterator;
            while (bit.next()) {
              const d = bit.value;
              if (this.containsNodeData(d)) modified.add(d);
            }
          }
        } else {
          const referenced = this._referencedNodeData(e.object);
          const rit = referenced.iterator;
          while (rit.next()) {
            const d = rit.value;
            if (this.containsNodeData(d)) modified.add(d);
          }
        }
      }
    }
    const insertedKeys: any[] = [];
    const iit = inserts.iterator;
    while (iit.next()) {
      const d = iit.value;
      const k = this.getKeyForNodeData(d);
      if (k !== undefined) insertedKeys.push(k);
      modified.add(d);
    }
    const removedKeys: any[] = [];
    const rit2 = removes.iterator;
    while (rit2.next()) {
      const d = rit2.value;
      const k = this.getKeyForNodeData(d);
      if (k !== undefined) removedKeys.push(k);
      modified.add(d);
    }
    const modifiedData: ObjectData[] = this.cloneDeep(modified.toArray());
    return {
      modelDataChanged: modelDataChanged,
      insertedKeys: insertedKeys,
      modifiedData: modifiedData,
      removedKeys: removedKeys,
      empty:
        !modelDataChanged &&
        insertedKeys.length === 0 &&
        modifiedData.length === 0 &&
        removedKeys.length === 0,
    };
  }

  /** 官方 Model.vg：模型自身属性的 JSON 片段 */
  private _modelPropsJson(): string {
    let s = '';
    if (this.name !== '') s += ',\n  "name": ' + this.quote(this.name);
    if (this.dataFormat !== '') s += ',\n  "dataFormat": ' + this.quote(this.dataFormat);
    if (this.isReadOnly) s += ',\n  "isReadOnly": ' + this.isReadOnly;
    if (this.nodeKeyProperty !== 'key' && typeof this.nodeKeyProperty === 'string') {
      s += ',\n  "nodeKeyProperty": ' + this.quote(this.nodeKeyProperty);
    }
    if (this.copiesArrays) s += ',\n  "copiesArrays": true';
    if (this.copiesArrayObjects) s += ',\n  "copiesArrayObjects": true';
    if (this.copiesKey) s += ',\n  "copiesKey": true';
    if (this.pointsDigits !== 100) s += ',\n  "pointsDigits": ' + this.pointsDigits.toString();
    if (this.nodeCategoryProperty !== 'category' && typeof this.nodeCategoryProperty === 'string') {
      s += ',\n  "nodeCategoryProperty": ' + this.quote(this.nodeCategoryProperty);
    }
    return s;
  }

  private _modelDataJson(): string {
    return ',\n  "modelData": ' + this._writeJsonObject(this.modelData);
  }

  private _writeArray(arr: any[], pretty?: boolean): string {
    const multi = pretty === true;
    const n = arr.length;
    if (n <= 0) return '[]';
    let s = '[';
    if (multi && n > 1) s += '\n';
    for (let i = 0; i < n; i++) {
      const v = arr[i];
      if (v === undefined) continue;
      if (s.length > 1) {
        s += ',';
        if (multi) s += '\n';
      }
      s += this.writeJsonValue(v);
    }
    if (multi && n > 1) s += '\n';
    return s + ']';
  }

  private _writeNumber(v: number): string {
    if (v === Infinity) return '9e9999';
    if (v === -Infinity) return '-9e9999';
    if (isNaN(v)) return 'NaN';
    return v.toString();
  }

  private _roundPoints(v: number): string {
    if (v === Infinity) return '9e9999';
    if (v === -Infinity) return '-9e9999';
    if (isNaN(v)) return '0';
    const d = this.pointsDigits;
    return d > 16 ? v.toString() : v.toFixed(d);
  }

  private _parseNumber(v: any): number {
    if (typeof v === 'number') return v;
    if (v === 'NaN') return NaN;
    if (v === '9e9999') return Infinity;
    if (v === '-9e9999') return -Infinity;
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  /** 官方 Model.NR：把一个对象写成 JSON 文本（几何类序列化成 {class:"go.*"}） */
  private _writeJsonObject(t: any): string {
    let obj: any = t;
    if (t instanceof Point) {
      obj = { class: 'go.Point', x: this._writeNumber(t.x), y: this._writeNumber(t.y) };
    } else if (t instanceof Size) {
      obj = { class: 'go.Size', width: this._writeNumber(t.width), height: this._writeNumber(t.height) };
    } else if (t instanceof Rect) {
      obj = {
        class: 'go.Rect',
        x: this._writeNumber(t.x),
        y: this._writeNumber(t.y),
        width: this._writeNumber(t.width),
        height: this._writeNumber(t.height),
      };
    } else if (t instanceof Margin) {
      obj = {
        class: 'go.Margin',
        top: this._writeNumber(t.top),
        right: this._writeNumber(t.right),
        bottom: this._writeNumber(t.bottom),
        left: this._writeNumber(t.left),
      };
    } else if (t instanceof Spot) {
      obj = t.isSpot()
        ? {
            class: 'go.Spot',
            x: this._writeNumber(t.x),
            y: this._writeNumber(t.y),
            offsetX: this._writeNumber(t.offsetX),
            offsetY: this._writeNumber(t.offsetY),
          }
        : { class: 'go.Spot', enum: t.toString() };
    } else if (t instanceof Brush) {
      obj = { class: 'go.Brush', type: t.type.toString() };
      if (t.type === BrushSolid) {
        obj.color = t.color;
      } else if (t.start) {
        obj.start = t.start;
        obj.end = t.end;
      }
      if (t.stops && t.stops.length > 0) {
        const stops: Record<string, any> = {};
        for (let i = 0; i < t.stops.length; i++) {
          stops[String(t.stops[i].offset)] = t.stops[i].color;
        }
        obj.colorStops = stops;
      }
    } else if (t instanceof Geometry) {
      obj = { class: 'go.Geometry', path: Geometry.stringify(t) };
      if (t.spot1 !== null && t.spot1 !== undefined) obj.spot1 = t.spot1;
      if (t.spot2 !== null && t.spot2 !== undefined) obj.spot2 = t.spot2;
    } else if (this._isDiagramReference(t)) {
      return '{}';
    }
    let s = '{';
    let first = true;
    for (const k in obj) {
      const v = obj[k];
      if (Model._skipProperty(v, k)) continue;
      if (first) first = false;
      else s += ',';
      s += this.quote(k) + ':' + this.writeJsonPropertyValue(k, v);
    }
    return s + '}';
  }

  /** 官方 Model.K4：把 {class:"go.*"} 还原成真实对象 */
  private _restoreJsonValue(t: any): any {
    if (t === null || typeof t !== 'object') return t;
    let cls = t.class || '';
    if (typeof cls !== 'string' || cls === '') return t;
    if (cls === 'NaN') return NaN;
    if (cls === 'Date') return new Date(t.value);
    if (cls.indexOf('go.') !== 0) return t;
    cls = cls.substring(3);
    if (cls === 'Point') return new Point(this._parseNumber(t.x), this._parseNumber(t.y));
    if (cls === 'Size') return new Size(this._parseNumber(t.width), this._parseNumber(t.height));
    if (cls === 'Rect') {
      return new Rect(
        this._parseNumber(t.x),
        this._parseNumber(t.y),
        this._parseNumber(t.width),
        this._parseNumber(t.height)
      );
    }
    if (cls === 'Margin') {
      return new Margin(
        this._parseNumber(t.top),
        this._parseNumber(t.right),
        this._parseNumber(t.bottom),
        this._parseNumber(t.left)
      );
    }
    if (cls === 'Spot') {
      if (typeof t.enum === 'string') return Spot.parse(t.enum);
      return new Spot(
        this._parseNumber(t.x),
        this._parseNumber(t.y),
        this._parseNumber(t.offsetX),
        this._parseNumber(t.offsetY)
      );
    }
    if (cls === 'Brush') {
      const b = new Brush(typeof t.color === 'string' ? t.color : undefined);
      if (t.start instanceof Point) b.start = t.start;
      if (t.end instanceof Point) b.end = t.end;
      const stops = t.colorStops;
      if (stops !== null && typeof stops === 'object') {
        for (const k in stops) b.addColorStop(parseFloat(k), stops[k]);
      }
      return b;
    }
    if (cls === 'Geometry') {
      if (typeof t.path === 'string') return Geometry.parse(t.path);
      return new Geometry();
    }
    if (cls === 'EnumValue') {
      return new EnumValue(typeof t.name === 'string' ? t.name : '');
    }
    return t;
  }

  /** 官方 Model.Nw：应用增量 JSON 的数据部分 */
  private _applyIncremental(obj: any): void {
    if (
      (obj.name !== undefined && obj.name !== this.name) ||
      (obj.dataFormat !== undefined && obj.dataFormat !== this.dataFormat) ||
      (obj.isReadOnly !== undefined && obj.isReadOnly !== this.isReadOnly) ||
      (obj.nodeKeyProperty !== undefined && obj.nodeKeyProperty !== this.nodeKeyProperty) ||
      (obj.copiesArrays !== undefined && obj.copiesArrays !== this.copiesArrays) ||
      (obj.copiesArrayObjects !== undefined && obj.copiesArrayObjects !== this.copiesArrayObjects) ||
      (obj.copiesKey !== undefined && obj.copiesKey !== this.copiesKey) ||
      (obj.nodeCategoryProperty !== undefined && obj.nodeCategoryProperty !== this.nodeCategoryProperty)
    ) {
      throw new Error('applyIncrementalJson cannot change Model properties');
    }
    this._applyModelData(obj.modelData);
    const inserted = obj.insertedNodeKeys;
    const modified = obj.modifiedNodeData;
    const byKey = new Map<any, ObjectData>();
    if (Array.isArray(modified)) {
      for (let i = 0; i < modified.length; i++) {
        const d = modified[i];
        const k = this.getKeyForNodeData(d);
        if (k !== null && k !== undefined) byKey.add(k, d);
      }
    }
    if (Array.isArray(inserted)) {
      for (let i = 0; i < inserted.length; i++) {
        const k = inserted[i];
        let data = this.findNodeDataForKey(k);
        if (data === null) {
          const fromModified = byKey.get(k);
          data = fromModified || this.copyNodeData({});
          if (data !== null) {
            this.setKeyForNodeData(data, k);
            this.addNodeData(data);
          }
        }
      }
    }
    if (Array.isArray(modified)) {
      for (let i = 0; i < modified.length; i++) {
        const d = modified[i];
        const existing = this.findNodeDataForKey(this.getKeyForNodeData(d));
        if (existing === null) continue;
        for (const c in d) {
          if (c === '__gohashid' || c === this.nodeKeyProperty || c === this.nodeIsGroupProperty) continue;
          this.setDataProperty(existing, c, d[c]);
        }
        this.copyCategory(d, existing);
      }
    }
    const removed = obj.removedNodeKeys;
    if (Array.isArray(removed)) {
      for (let i = 0; i < removed.length; i++) {
        const data = this.findNodeDataForKey(removed[i]);
        if (data !== null) this.removeNodeData(data);
      }
    }
  }

  private _applyModelData(md: any): void {
    if (md === null || typeof md !== 'object') return;
    for (const k in md) {
      const v = md[k];
      if (Model._skipProperty(v, k)) continue;
      if (this.modelData[k] !== v) this.setModelData(k, v);
    }
  }

  // ============ 辅助方法 ============


  /** 重建 key 映射 */
  private _rebuildKeyMap(): void {
    this._keyMap.clear();
    for (const data of this._nodeDataArray) {
      const key = this.getKeyForNodeData(data);
      if (key !== undefined) {
        this._keyMap.add(key, data);
      }
    }
    // 更新 nextKey
    let maxKey = 0;
    const it = this._keyMap.iteratorKeys;
    while (it.next()) {
      if (typeof it.value === 'number' && it.value >= maxKey) {
        maxKey = it.value + 1;
      }
    }
    this._nextKey = maxKey || 1;
  }

  /** 清空 */
  clear(): void {
    this._nodeDataArray.length = 0;
    this._keyMap.clear();
    this._nextKey = 1;
  }

  /** 复制模型 */
  copy(): Model {
    const m = new Model();
    this.cloneProtected(m);
    m._nodeDataArray = this._nodeDataArray.map(d => this.cloneDeep(d));
    m._rebuildKeyMap();
    return m;
  }

  /** 模板方法：复制属性到新模型 */
  cloneProtected(copy: Model): void {
    copy.nodeKeyProperty = this.nodeKeyProperty;
    copy.nodeCategoryProperty = this.nodeCategoryProperty;
    copy.nodeIsGroupProperty = this.nodeIsGroupProperty;
    copy.nodeGroupKeyProperty = this.nodeGroupKeyProperty;
    copy.linkLabelKeysProperty = this.linkLabelKeysProperty;
    copy.isReadOnly = this.isReadOnly;
    copy.dataFormat = this.dataFormat;
    copy.name = this.name;
    copy.copiesArrayObjects = this.copiesArrayObjects;
    copy.copiesArrays = this.copiesArrays;
    copy.copiesKey = this.copiesKey;
    copy.pointsDigits = this.pointsDigits;
    copy.modelData = this.cloneDeep(this.modelData);
    copy.makeUniqueKeyFunction = this.makeUniqueKeyFunction;
    copy.afterCopyFunction = this.afterCopyFunction;
    copy.copyNodeDataFunction = this.copyNodeDataFunction;
    copy.makeUniqueLinkKeyFunction = this.makeUniqueLinkKeyFunction;
    copy.copyLinkDataFunction = this.copyLinkDataFunction;
  }

  /**
   * 官方 `Model.set` 有两个签名（go.d.ts）：
   * - `set(props: Partial<Model>): this` —— 批量设置模型自身属性；
   * - `set(data: ObjectData, propname: string, val: any): void` —— 给某个**数据对象**
   *   赋属性并 raise changed event（`Model.setDataProperty` 的同义词）。
   * 以前只实现了第一个签名，于是样例里 `model.set(node.data, 'start', 7)` 被当成
   * 「用 node.data 批量设模型属性」，静默什么都不做
   * （实测 gantt：`assignTimes` 永远填不上 start/duration，任务条 x 全是 NaN）。
   */
set(props: Partial<Model>): this;
  set(data: any, propname: string, val: any): void;
  set(a: any, b?: any, c?: any): any {
    if (typeof b === 'string') {
      return this.setDataProperty(a, b, c);
    }
    const props = a as Partial<Model>;
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        if ((this as any)[key] !== undefined) {
          (this as any)[key] = (props as any)[key];
        }
      }
    }
    return this;
  }
}
