import { ChangedEvent } from './ChangedEvent';
import { UndoManager } from './UndoManager';
import { Binding } from './Binding';
import { List } from '../core/List';
import { Map } from '../core/Map';
import { ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction } from '../core/EnumValues';

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
 * Model - 基础模型
 * 管理 nodeDataArray，支持数据绑定、事务和撤销/重做
 */
export class Model {
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
    this._nodeDataArray = val || [];
    this._rebuildKeyMap();
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
  findNodeDataForKey(key: any): ObjectData | undefined {
    return this._keyMap.get(key);
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
  commit(func: () => any, tname: string = 'commit'): any {
    this.startTransaction(tname);
    let result: any;
    try {
      result = func();
    } catch (e) {
      this.rollbackTransaction();
      throw e;
    }
    this.commitTransaction(tname);
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
  toJson(): string {
    const data: any = {
      class: 'Model',
      nodeDataArray: this._nodeDataArray,
    };
    if (Object.keys(this.modelData).length > 0) {
      data.modelData = this.modelData;
    }
    return JSON.stringify(data, null, 2);
  }

  /** 从 JSON 反序列化 */
  static fromJson(json: string | object): Model {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const cls = data.class || 'Model';
    let model: Model;
    if (cls === 'GraphLinksModel') {
      const GLM = require('./GraphLinksModel').GraphLinksModel;
      model = new GLM();
      if (data.linkDataArray) {
        (model as any).linkDataArray = data.linkDataArray;
      }
      if (data.linkFromPortIdProperty !== undefined) {
        (model as any).linkFromPortIdProperty = data.linkFromPortIdProperty;
      }
      if (data.linkToPortIdProperty !== undefined) {
        (model as any).linkToPortIdProperty = data.linkToPortIdProperty;
      }
      if (data.linkLabelKeysProperty !== undefined) {
        (model as any).linkLabelKeysProperty = data.linkLabelKeysProperty;
      }
    } else if (cls === 'TreeModel') {
      const TM = require('./TreeModel').TreeModel;
      model = new TM();
    } else {
      model = new Model();
    }
    if (data.nodeDataArray) {
      model.nodeDataArray = data.nodeDataArray;
    }
    if (data.modelData) {
      model.modelData = data.modelData;
    }
    if (data.nodeKeyProperty !== undefined) {
      model.nodeKeyProperty = data.nodeKeyProperty;
    }
    if (data.nodeCategoryProperty !== undefined) {
      model.nodeCategoryProperty = data.nodeCategoryProperty;
    }
    return model;
  }

  static fromJSON(json: string | object): Model {
    return Model.fromJson(json);
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
    const it = this._keyMap.keys;
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
    copy.copyNodeDataFunction = this.copyNodeDataFunction;
    copy.makeUniqueLinkKeyFunction = this.makeUniqueLinkKeyFunction;
    copy.copyLinkDataFunction = this.copyLinkDataFunction;
  }

  /** 批量设置属性 */
  set(props: Partial<Model>): this {
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
