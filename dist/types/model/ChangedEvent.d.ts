import { EnumValue } from '../core/EnumValues';
/**
 * ChangedEvent - 变更事件
 * 记录模型或图表的属性/插入/删除变更
 */
export declare class ChangedEvent {
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
    /** 额外参数 */
    parameter: any;
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
}
