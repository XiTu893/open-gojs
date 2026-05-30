import { Transaction } from './Transaction';
import { ChangedEvent } from './ChangedEvent';
/**
 * UndoManager - 撤销管理器
 */
export declare class UndoManager {
    private _undoStack;
    private _redoStack;
    private _currentTransaction;
    private _transactionLevel;
    private _maxHistory;
    private _isEnabled;
    private _hasUndo;
    private _hasRedo;
    private _model;
    private _changes;
    private _stateChangedListeners;
    private _skipsUndoManager;
    private _handlesModelChanges;
    constructor();
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get model(): any;
    set model(val: any);
    get transactionLevel(): number;
    get isInTransaction(): boolean;
    get hasUndo(): boolean;
    get hasRedo(): boolean;
    get canUndo(): boolean;
    get canRedo(): boolean;
    get transactionToUndo(): Transaction | null;
    get transactionToRedo(): Transaction | null;
    get currentTransaction(): Transaction | null;
    get undoStack(): Transaction[];
    get redoStack(): Transaction[];
    get maxHistory(): number;
    set maxHistory(val: number);
    startTransaction(name?: string): boolean;
    commitTransaction(name?: string): boolean;
    rollbackTransaction(): boolean;
    handleChanged(change: ChangedEvent): void;
    get handlesModelChanges(): boolean;
    set handlesModelChanges(val: boolean);
    undo(): boolean;
    redo(): boolean;
    /** 清空历史 */
    clear(): void;
    private _undoChange;
    private _redoChange;
    /** 修剪历史记录 */
    private _trimHistory;
    /** 添加状态变更监听器 */
    addStateChangedListener(listener: (manager: UndoManager) => void): void;
    /** 移除状态变更监听器 */
    removeStateChangedListener(listener: (manager: UndoManager) => void): void;
    private _fireStateChanged;
    private _fireTransactionEvent;
}
