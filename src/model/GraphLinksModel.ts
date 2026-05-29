import { Model, ObjectData } from './Model';
import { ChangedEvent } from './ChangedEvent';
import { Map } from '../core/Map';
import { ChangedEventInsert, ChangedEventRemove } from '../core/EnumValues';

/**
 * GraphLinksModel - 图连接模型
 * 额外管理 linkDataArray，支持任意拓扑
 */
export class GraphLinksModel extends Model {
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
    this._linkDataArray = linkDataArray || [];
    this._rebuildLinkKeyMap();
  }

  // ============ 链接数据管理 ============

  get linkDataArray(): ObjectData[] {
    return this._linkDataArray;
  }
  set linkDataArray(val: ObjectData[]) {
    this._linkDataArray = val || [];
    this._rebuildLinkKeyMap();
  }

  /** 添加链接数据 */
  addLinkData(data: ObjectData): void {
    if (!data) throw new Error('Cannot add null link data');
    if (this.isReadOnly) throw new Error('Model is read-only');
    this._linkDataArray.push(data);
    if (this.linkKeyProperty) {
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

  /** 根据 key 查找链接数据 */
  findLinkDataForKey(key: any): ObjectData | undefined {
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

  // ============ 序列化 ============

  toJson(): string {
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
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const model = new GraphLinksModel();
    if (data.nodeDataArray) {
      model.nodeDataArray = data.nodeDataArray;
    }
    if (data.linkDataArray) {
      model.linkDataArray = data.linkDataArray;
    }
    if (data.modelData) {
      model.modelData = data.modelData;
    }
    return model;
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
