import { ChangedEvent } from './ChangedEvent';
/**
 * Transaction - 事务
 * 组合多个 ChangedEvent，支持嵌套
 */
export declare class Transaction {
    static readonly className: string;
    name: string;
    private _changes;
    private _level;
    private _nestedNames;
    constructor(name?: string);
    get changes(): ChangedEvent[];
    get level(): number;
    get nestedNames(): string[];
    addNestedName(name: string): void;
    /** 添加变更事件 */
    addChange(change: ChangedEvent): void;
    begin(): void;
    end(): void;
    /** 是否已完成（无嵌套） */
    get isComplete(): boolean;
    /** 变更数量 */
    get count(): number;
    clear(): void;
    copy(): Transaction;
    toString(): string;
    /** 官方 Transaction.canUndo：事务完整才可撤销 */
    canUndo(): boolean;
    /** 官方.Transaction.undo：倒序回放所有变更 */
    undo(): void;
    /** 官方 Transaction.canRedo */
    canRedo(): boolean;
    /** 官方 Transaction.redo：正序重放所有变更 */
    redo(): void;
    /** 官方 Transaction.thaw：本项目的 changes 是普通数组，无冻结语义，保持空实现 */
    thaw(): void;
    /**
     * 官方 Transaction.optimize：把同一对象同一属性的连续 Property 变更合并成最后一条。
     * 官方实现先把被合并项置为 null 再压紧数组；这里等价地重建数组，避免数组里出现 null。
     */
    optimize(): void;
    /** 官方 Transaction.WI：把另一份变更列表追加到本事务尾部 */
    addAllChanges(changes: ChangedEvent[]): void;
}
