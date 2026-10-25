import { EnumValue } from '../core/EnumValues';
/**
 * ChangedEvent - 变更事件
 * 记录模型或图表的属性/插入/删除变更
 */
export declare class ChangedEvent {
    static readonly className: string;
    /** 变更类型 */
    change: EnumValue;
    /** 变更主体对象 */
    object: any;
    /** 属性名 */
    propertyName: string;
    /** 旧值 */
    oldValue: any;
    /** 新值 */
    newValue: any;
    /** 索引（用于数组操作） */
    index: number;
    /** 事务名称 */
    transactionName: string;
    /** 是否来自模型 */
    isModelChange: boolean;
    /** 产生此事件的 Model */
    model: any;
    /** 产生此事件的 Diagram（官方 ChangedEvent.diagram） */
    diagram: any;
    /** 额外参数 */
    parameter: any;
    /** 旧的附加参数（官方 ChangedEvent.oldParam） */
    oldParam: any;
    /** 新的附加参数（官方 ChangedEvent.newParam） */
    newParam: any;
    constructor();
    constructor(change: EnumValue, object: any, propertyName?: string, oldValue?: any, newValue?: any, index?: number);
    /** 是否为属性变更 */
    get isPropertyChange(): boolean;
    /** 是否为插入变更 */
    get isInsertChange(): boolean;
    /** 是否为删除变更 */
    get isRemoveChange(): boolean;
    get isTransactionChange(): boolean;
    get isTransactionFinished(): boolean;
    /** 复制 */
    copy(): ChangedEvent;
    /** 重置 */
    clear(): void;
    toString(): string;
    /** 官方 ChangedEvent.modelChange：模型数据级变更名（'nodeDataArray' / 'linkDataArray' / 'modelData.x'…） */
    modelChange: string;
    /** @deprecated 官方静态别名，等价于 ChangeType.Transaction */
    static readonly Transaction: EnumValue;
    /** @deprecated 官方静态别名，等价于 ChangeType.Property */
    static readonly Property: EnumValue;
    /** @deprecated 官方静态别名，等价于 ChangeType.Insert */
    static readonly Insert: EnumValue;
    /** @deprecated 官方静态别名，等价于 ChangeType.Remove */
    static readonly Remove: EnumValue;
    /** 官方 ChangedEvent.getValue：undo 取旧值，否则取新值 */
    getValue(undo: boolean): any;
    /** 官方 ChangedEvent.getParam：undo 取旧参数，否则取新参数 */
    getParam(undo: boolean): any;
    /** 官方 ChangedEvent.canUndo */
    canUndo(): boolean;
    /** 官方 ChangedEvent.undo：把对象状态倒回旧值 */
    undo(): void;
    /** 官方 ChangedEvent.canRedo */
    canRedo(): boolean;
    /** 官方 ChangedEvent.redo：把对象状态推进到新值 */
    redo(): void;
}
