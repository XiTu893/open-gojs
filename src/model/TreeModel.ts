import { Model, ObjectData } from './Model';

/**
 * TreeModel - 树模型
 * 通过 parentKey 属性定义层级关系，无需 linkDataArray
 */
export class TreeModel extends Model {
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

  // ============ 序列化 ============

  toJson(): string {
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
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const model = new TreeModel();
    if (data.nodeDataArray) {
      model.nodeDataArray = data.nodeDataArray;
    }
    if (data.modelData) {
      model.modelData = data.modelData;
    }
    return model;
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
  }
}
