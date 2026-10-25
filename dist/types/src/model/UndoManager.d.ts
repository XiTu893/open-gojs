import { Transaction } from './Transaction';
import { ChangedEvent } from './ChangedEvent';
import { List } from '../core/List';
import { Iterator } from '../core/Iterable';
/**
 * UndoManager - 撤销管理器
 */
export declare class UndoManager {
    static readonly className: string;
    private _undoStack;
    private _redoStack;
    private _currentTransaction;
    private _transactionLevel;
    private _maxHistory;
    /** 官方 `UndoManager` 构造器默认 `this.Wi = false`（isEnabled=false）。
     * 样例想要撤销必须显式 `'undoManager.isEnabled': true`。早先本项目默认 true，
     * 导致 updateDemo 这类「先赋 model 再开 undo」的样例在初始布局时就冒出
     * 事务 ChangedEvent（官方因 isEnabled=false 静默不发）。 */
    private _isEnabled;
    private _hasUndo;
    private _hasRedo;
    private _model;
    private _changes;
    private _stateChangedListeners;
    private _skipsUndoManager;
    private _handlesModelChanges;
    private _hasStartedFirstTransaction;
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
    private _models;
    private _nestedTransactionNames;
    private _checksTransactionLevel;
    private _isJustDiscarded;
    /** 官方 UndoManager.models：所有关联模型的迭代器 */
    get models(): Iterator<any>;
    /** 官方 UndoManager.addModel */
    addModel(model: any): void;
    /** 官方 UndoManager.removeModel */
    removeModel(model: any): void;
    /**
     * 官方 UndoManager.history：已提交事务的历史。
     * 官方是一条 List（historyIndex 指向最近一次可撤销的事务）；
     * 本项目内部是 undo/redo 两个栈，这里按官方语义拼出等价快照：
     * 顺序 = 撤销栈正序 + 重做栈逆序。
     */
    get history(): List<Transaction>;
    /** 官方 UndoManager.historyIndex：最近一条可撤销事务在 history 中的下标 */
    get historyIndex(): number;
    /** 官方 UndoManager.maxHistoryLength（本项目默认 0 表示不限长度，官方默认 999） */
    get maxHistoryLength(): number;
    set maxHistoryLength(value: number);
    /** 官方 UndoManager.nestedTransactionNames */
    get nestedTransactionNames(): List<string>;
    /** 官方 UndoManager.checksTransactionLevel */
    get checksTransactionLevel(): boolean;
    set checksTransactionLevel(value: boolean);
    /** 官方 UndoManager.isUndoingRedoing：撤销/重放过程中为 true */
    get isUndoingRedoing(): boolean;
    /** 官方 UndoManager.isJustDiscarded */
    get isJustDiscarded(): boolean;
    /** 官方 UndoManager.discardHistoryAfterIndex：丢掉 historyIndex 之后（可重做）的事务 */
    discardHistoryAfterIndex(): void;
    /**
     * 官方 UndoManager.combineTransactions：把紧跟在 target 之后的那条事务
     * 的全部变更并入 target，并从历史里删掉它。不传 target 时合并最后两条。
     */
    combineTransactions(target?: Transaction): void;
    /** 官方 UndoManager.copyProperties：只拷贝三个可配置属性 */
    copyProperties(other: UndoManager): void;
    /** 官方 UndoManager.thaw：本项目历史是普通数组，无冻结语义，保持空实现 */
    thaw(): void;
    /** 官方 UndoManager.skipsEvent：临时层对象与事务事件本身不进历史 */
    skipsEvent(e: ChangedEvent | null): boolean;
    /** 官方 UndoManager.toString */
    toString(level?: number): string;
}
