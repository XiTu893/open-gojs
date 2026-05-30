import { ChangedEvent } from './ChangedEvent';
import { UndoManager } from './UndoManager';
import { List } from '../core/List';
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
export declare class Model {
    /** 数据格式名称 */
    dataFormat: string;
    /** 模型名称 */
    name: string;
    /** 节点 key 属性名 */
    nodeKeyProperty: string;
    /** 节点分类属性名 */
    nodeCategoryProperty: string;
    /** 是否只读 */
    isReadOnly: boolean;
    /** 复制时是否深拷贝数组中的对象 */
    copiesArrayObjects: boolean;
    /** 复制时是否深拷贝数组 */
    copiesArrays: boolean;
    /** 复制时是否保留 key */
    copiesKey: boolean;
    /** 点坐标小数位数 */
    pointsDigits: number;
    /** 是否跳过撤销管理器 */
    skipsUndoManager: boolean;
    /** 模型级别数据 */
    modelData: ObjectData;
    /** 自定义 key 生成函数 */
    makeUniqueKeyFunction: ((model: Model, data: ObjectData) => any) | null;
    /** 自定义节点数据复制函数 */
    copyNodeDataFunction: ((data: ObjectData, model: Model) => ObjectData) | null;
    /** 节点是否为分组的属性名 */
    nodeIsGroupProperty: string;
    /** 节点所属分组 key 的属性名 */
    nodeGroupKeyProperty: string;
    /** 链接标签 key 数组的属性名 */
    linkLabelKeysProperty: string;
    /** 自定义链接 key 生成函数 */
    makeUniqueLinkKeyFunction: ((model: Model, data: ObjectData) => any) | null;
    /** 自定义链接数据复制函数 */
    copyLinkDataFunction: ((data: ObjectData, model: Model) => ObjectData) | null;
    private _nodeDataArray;
    private _undoManager;
    private _changedListeners;
    private _keyMap;
    private _nextKey;
    constructor();
    constructor(init: Partial<Model> | ObjectData[]);
    get nodeDataArray(): ObjectData[];
    set nodeDataArray(val: ObjectData[]);
    /** 添加节点数据 */
    addNodeData(data: ObjectData): void;
    /** 添加节点数据集合 */
    addNodeDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 移除节点数据 */
    removeNodeData(data: ObjectData): boolean;
    /** 移除节点数据集合 */
    removeNodeDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 是否包含节点数据 */
    containsNodeData(data: ObjectData): boolean;
    /** 根据 key 查找节点数据 */
    findNodeDataForKey(key: any): ObjectData | undefined;
    /** 获取节点的 key */
    getKeyForNodeData(data: ObjectData): any;
    /** 设置节点的 key */
    setKeyForNodeData(data: ObjectData, key: any): void;
    /** 获取节点的分类 */
    getCategoryForNodeData(data: ObjectData): string;
    /** 设置节点的分类 */
    setCategoryForNodeData(data: ObjectData, category: string): void;
    /** 判断节点是否为分组 */
    isGroupForNodeData(data: ObjectData): boolean;
    /** 设置节点是否为分组 */
    setIsGroupForNodeData(data: ObjectData, flag: boolean): void;
    /** 获取节点的分组 key */
    getGroupKeyForNodeData(data: ObjectData): any;
    /** 设置节点的分组 key */
    setGroupKeyForNodeData(data: ObjectData, key: any): void;
    /** 获取 modelData 中的属性 */
    getModelData(key: string): any;
    /** 设置 modelData 中的属性（支持撤销） */
    setModelData(key: string, value: any): void;
    /** 设置数据属性（支持撤销） */
    setDataProperty(data: ObjectData, propname: string, value: any): void;
    /** 向数组添加项 */
    addArrayItem(arr: any[], item: any): void;
    /** 在数组指定位置插入项 */
    insertArrayItem(arr: any[], index: number, item: any): void;
    /** 移除数组项 */
    removeArrayItem(arr: any[], index?: number): void;
    /** 确保 key 唯一 */
    ensureUniqueKey(data: ObjectData): void;
    /** 复制节点数据 */
    copyNodeData(data: ObjectData): ObjectData;
    /** 深度克隆 */
    cloneDeep(obj: any): any;
    get undoManager(): UndoManager;
    startTransaction(tname?: string): boolean;
    commitTransaction(tname?: string): boolean;
    rollbackTransaction(): boolean;
    /** 在事务中执行函数 */
    commit(func: () => any, tname?: string): any;
    addChangedListener(listener: ChangedEventListener): void;
    removeChangedListener(listener: ChangedEventListener): void;
    raiseChangedEvent(change: any, object: any, propertyName: string, oldValue: any, newValue: any, index?: number): ChangedEvent;
    raiseTransactionEvent(propertyName: string, tname: string, transObj?: any): ChangedEvent;
    /** 更新目标绑定 */
    updateTargetBindings(propname?: string): void;
    /** 序列化为 JSON */
    toJson(): string;
    /** 从 JSON 反序列化 */
    static fromJson(json: string | object): Model;
    static fromJSON(json: string | object): Model;
    /** 重建 key 映射 */
    private _rebuildKeyMap;
    /** 清空 */
    clear(): void;
    /** 复制模型 */
    copy(): Model;
    /** 模板方法：复制属性到新模型 */
    cloneProtected(copy: Model): void;
    /** 批量设置属性 */
    set(props: Partial<Model>): this;
}
