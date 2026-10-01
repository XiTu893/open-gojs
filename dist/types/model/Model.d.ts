import { ChangedEvent } from './ChangedEvent';
import { UndoManager } from './UndoManager';
import { List } from '../core/List';
import { Map } from '../core/Map';
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
export declare class Model {
    static readonly className: string;
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
    findNodeDataForKey(key: any): ObjectData | null;
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
    commit(func: (owner?: any) => any, tname?: string): any;
    addChangedListener(listener: ChangedEventListener): void;
    removeChangedListener(listener: ChangedEventListener): void;
    raiseChangedEvent(change: any, object: any, propertyName: string, oldValue: any, newValue: any, index?: number): ChangedEvent;
    raiseTransactionEvent(propertyName: string, tname: string, transObj?: any): ChangedEvent;
    /** 更新目标绑定 */
    updateTargetBindings(propname?: string): void;
    /** 序列化为 JSON */
    toJson(_classname?: string): string;
    /**
     * `toJson()` 写出的 `class` 名 → `{ ctor, apply }` 的注册表。
     * 官方靠内部注册表解析；这里由各子类在模块求值时自注册，
     * 避免在 `Model.ts` 里 `require('./GraphLinksModel')` —— 那是 CommonJS
     * 调用，在浏览器 bundle 里会抛 `require is not defined`，
     * 导致所有走 `Model.fromJson()` 的样例直接崩（实测 13 个）。
     */
    private static readonly _ctors;
    /**
     * 由子类模块在顶层调用：
     *   `Model.registerClass('TreeModel', TreeModel, (m, d) => { ... })`
     * `apply` 只负责该子类**自己**的额外字段；公共字段由 `fromJson` 统一处理。
     */
    static registerClass(name: string, ctor: new () => Model, apply?: (m: Model, data: any) => void): void;
    /**
     * 解析 `class` 字段 → 构造器 + `apply`。
     * 对齐官方 `Model.I3()`（`node_modules/gojs/release/go.js`）：
     *  - `go.Xxx` → 只查内部注册表（去掉 `go.` 前缀）
     *  - `Xxx`    → 先查内部注册表，查不到再查全局 `globalThis.Xxx`
     *  - 只有"可构造的函数"才会被采用，否则返回 null
     */
    private static _resolveClass;
    /**
     * 从 JSON 反序列化。
     * 语义对齐官方 `Model.fromJson(t, e)`（见 `node_modules/gojs/release/go.js`）：
     *  - 字符串 → `JSON.parse`，**解析失败静默降级为 null**（官方用 try/catch 吞掉）
     *  - 非字符串非对象 → 抛 `Unable to construct a Model from: <t>`
     *  - `class` 未注册 → 回落到普通 `Model`（官方 `I3()` 返回 null 后走 `Mv()`）
     */
    static fromJson(json: string | object, target?: Model): Model;
    static fromJSON(json: string | object): Model;
    private _afterCopyFunction;
    get afterCopyFunction(): ((map: Map<any, any>, destModel: Model, srcModel: Model) => void) | null;
    set afterCopyFunction(value: ((map: Map<any, any>, destModel: Model, srcModel: Model) => void) | null);
    /** 官方 Model.type：序列化时使用的类名 */
    get type(): string;
    /** 官方 Model.toString(level)：level>1 返回 JSON，level>0 附带节点数据摘要 */
    toString(level?: number): string;
    /** 官方 Model.isKeyType：只有 number/string 才能作为 key */
    isKeyType(key: any): boolean;
    /** 官方 Model.raiseChanged：object 恒为 Model 自身 */
    raiseChanged(propertyName: string, oldValue: any, newValue: any, oldParam?: any, newParam?: any): void;
    /** 官方 Model.raiseDataChanged：object 为发生变更的那份数据对象 */
    raiseDataChanged(data: ObjectData, propertyname: string, oldval: any, newval: any, oldparam?: any, newparam?: any): void;
    /** 官方 Model.changeState：由 UndoManager 正放/倒放一条变更 */
    changeState(e: ChangedEvent, undo: boolean): void;
    /** 官方 Model.makeNodeDataKeyUnique */
    makeNodeDataKeyUnique(nodedata: ObjectData): void;
    /** 官方 Model.mergeNodeDataArray：按 key 合并一份数据进来 */
    mergeNodeDataArray(arr: ObjectData[]): void;
    /** 官方 Model.assignAllDataProperties */
    assignAllDataProperties(data: ObjectData, props: ObjectData): void;
    /** 官方 Model.quote：把 charCode >= 127 的字符转成 \\uXXXX */
    quote(val: any): string;
    /** 官方 Model.toJSON */
    toJSON(classname?: string): string;
    /** 官方 Model.toIncrementalData */
    toIncrementalData(e: ChangedEvent): IncrementalData | null;
    /** 官方 Model.toIncrementalJson */
    toIncrementalJson(e: ChangedEvent, classname?: string): string;
    /** 官方 Model.toIncrementalJSON */
    toIncrementalJSON(e: ChangedEvent, classname?: string): string;
    /** 官方 Model.applyIncrementalJson */
    applyIncrementalJson(s: string | ObjectData): void;
    /** 官方 Model.applyIncrementalJSON */
    applyIncrementalJSON(s: string | ObjectData): void;
    /** 官方 Model.replaceJsonObjects：就地把 JSON 里的 {class:"go.*"} 换回真实对象 */
    replaceJsonObjects(t: any): any;
    /** 官方 Model.replaceJsonPropertyValue：points 数字数组 -> List of Point */
    replaceJsonPropertyValue(x: ObjectData, p: string, replaced: any): void;
    /** 官方 Model.writeJsonValue */
    writeJsonValue(t: any): string;
    /** 官方 Model.writeJsonPropertyValue */
    writeJsonPropertyValue(p: string, v: any): string;
    /** 官方 cloneProtected 需要一并复制的分类属性 */
    protected copyCategory(from: ObjectData, to: ObjectData): void;
    private static _stringify;
    private static _escapeNonAscii;
    private static _skipProperty;
    private static _isPlainObject;
    /** 官方 Model.FA：数据里不该出现的 Diagram/Part 引用 */
    private _isDiagramReference;
    private _raiseModelEvent;
    private _attachNodeData;
    private _detachNodeData;
    private _sharedPartData;
    /** 官方 Model.MR：找出引用了 target 的那些节点数据 */
    private _referencedNodeData;
    private _findReference;
    private _collectIncremental;
    /** 官方 Model.vg：模型自身属性的 JSON 片段 */
    private _modelPropsJson;
    private _modelDataJson;
    private _writeArray;
    private _writeNumber;
    private _roundPoints;
    private _parseNumber;
    /** 官方 Model.NR：把一个对象写成 JSON 文本（几何类序列化成 {class:"go.*"}） */
    private _writeJsonObject;
    /** 官方 Model.K4：把 {class:"go.*"} 还原成真实对象 */
    private _restoreJsonValue;
    /** 官方 Model.Nw：应用增量 JSON 的数据部分 */
    private _applyIncremental;
    private _applyModelData;
    /** 重建 key 映射 */
    private _rebuildKeyMap;
    /** 清空 */
    clear(): void;
    /** 复制模型 */
    copy(): Model;
    /** 模板方法：复制属性到新模型 */
    cloneProtected(copy: Model): void;
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
}
