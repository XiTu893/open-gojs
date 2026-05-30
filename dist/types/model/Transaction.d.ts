import { ChangedEvent } from './ChangedEvent';
/**
 * Transaction - 事务
 * 组合多个 ChangedEvent，支持嵌套
 */
export declare class Transaction {
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
}
