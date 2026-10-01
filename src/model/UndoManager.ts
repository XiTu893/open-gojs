import { Transaction } from './Transaction';
import { ChangedEvent } from './ChangedEvent';
import { ChangedEventTransaction, ChangedEventInsert, ChangedEventRemove } from '../core/EnumValues';
import { List } from '../core/List';
import { Iterator } from '../core/Iterable';

/**
 * UndoManager - 撤销管理器
 */
export class UndoManager {
  static readonly className: string = "UndoManager";
  private _undoStack: Transaction[] = [];
  private _redoStack: Transaction[] = [];
  private _currentTransaction: Transaction | null = null;
  private _transactionLevel: number = 0;
  private _maxHistory: number = 0; // 0 = unlimited
  private _isEnabled: boolean = true;
  private _hasUndo: boolean = false;
  private _hasRedo: boolean = false;
  private _model: any = null;
  private _changes: ChangedEvent[] = [];
  private _stateChangedListeners: ((manager: UndoManager) => void)[] = [];
  private _skipsUndoManager: boolean = false;
  private _handlesModelChanges: boolean = true;
  private _hasStartedFirstTransaction: boolean = false;

  constructor() {}

  get isEnabled(): boolean {
    return this._isEnabled;
  }
  set isEnabled(val: boolean) {
    if (this._isEnabled !== val) {
      this._isEnabled = val;
      if (!val) {
        this.clear();
      }
    }
  }

  get model(): any {
    return this._model;
  }
  set model(val: any) {
    this._model = val;
  }

  get transactionLevel(): number {
    return this._transactionLevel;
  }

  get isInTransaction(): boolean {
    return this._transactionLevel > 0;
  }

  get hasUndo(): boolean {
    return this._undoStack.length > 0;
  }

  get hasRedo(): boolean {
    return this._redoStack.length > 0;
  }

  get canUndo(): boolean {
    return this.isEnabled && this._undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.isEnabled && this._redoStack.length > 0;
  }

  get transactionToUndo(): Transaction | null {
    return this._undoStack.length > 0 ? this._undoStack[this._undoStack.length - 1] : null;
  }

  get transactionToRedo(): Transaction | null {
    return this._redoStack.length > 0 ? this._redoStack[this._redoStack.length - 1] : null;
  }

  get currentTransaction(): Transaction | null {
    return this._currentTransaction;
  }

  get undoStack(): Transaction[] {
    return this._undoStack;
  }

  get redoStack(): Transaction[] {
    return this._redoStack;
  }

  get maxHistory(): number {
    return this._maxHistory;
  }
  set maxHistory(val: number) {
    this._maxHistory = Math.max(0, val);
    this._trimHistory();
  }

  startTransaction(name: string = ''): boolean {
    if (!this._isEnabled) return false;
    this._nestedTransactionNames.push(name);
    this._transactionLevel++;
    if (this._transactionLevel === 1) {
      this._currentTransaction = new Transaction(name);
      this._changes = [];
      // 官方：只有本 UndoManager 的第一次事务才有 StartingFirstTransaction
      if (!this._hasStartedFirstTransaction) {
        this._hasStartedFirstTransaction = true;
        this._fireTransactionEvent('StartingFirstTransaction', name);
      }
      this._fireTransactionEvent('StartedTransaction', name);
    } else if (this._currentTransaction) {
      this._currentTransaction.begin();
      this._currentTransaction.addNestedName(name);
    }
    return true;
  }

  commitTransaction(name?: string): boolean {
    if (!this._isEnabled) return false;
    if (this._transactionLevel <= 0) return false;
    if (this._nestedTransactionNames.length > 0) this._nestedTransactionNames.pop();

    this._transactionLevel--;
    if (name !== undefined && this._currentTransaction) {
      this._currentTransaction.name = name;
    }

    if (this._transactionLevel === 0) {
      if (this._currentTransaction) {
        this._fireTransactionEvent('CommittingTransaction', this._currentTransaction.name);
        for (const change of this._changes) {
          this._currentTransaction.addChange(change);
        }
        const committed = this._currentTransaction;
        if (this._currentTransaction.count > 0) {
          this._undoStack.push(this._currentTransaction);
          this._redoStack.length = 0;
          this._trimHistory();
        }
        this._currentTransaction = null;
        this._changes = [];
        this._fireStateChanged();
        this._fireTransactionEvent('CommittedTransaction', committed.name, committed);
      }
    } else if (this._currentTransaction) {
      this._currentTransaction.end();
    }
    return true;
  }

  rollbackTransaction(): boolean {
    if (!this._isEnabled) return false;
    if (this._transactionLevel <= 0) return false;
    if (this._nestedTransactionNames.length > 0) this._nestedTransactionNames.pop();

    this._transactionLevel--;
    if (this._transactionLevel === 0) {
      const tname = this._currentTransaction ? this._currentTransaction.name : '';
      if (this._changes.length > 0) {
        for (let i = this._changes.length - 1; i >= 0; i--) {
          this._undoChange(this._changes[i]);
        }
      }
      this._currentTransaction = null;
      this._changes = [];
      this._fireStateChanged();
      this._fireTransactionEvent('RollbackTransaction', tname);
    } else if (this._currentTransaction) {
      this._currentTransaction.end();
    }
    return true;
  }

  handleChanged(change: ChangedEvent): void {
    if (!this._isEnabled) return;
    if (!this._handlesModelChanges) return;
    if (this._skipsUndoManager) return;
    if (this._transactionLevel > 0) {
      this._changes.push(change);
    }
  }

  get handlesModelChanges(): boolean { return this._handlesModelChanges; }
  set handlesModelChanges(val: boolean) { this._handlesModelChanges = val; }

  undo(): boolean {
    if (!this._isEnabled || !this.hasUndo) return false;
    const transaction = this._undoStack.pop()!;
    this._redoStack.push(transaction);

    this._skipsUndoManager = true;
    const changes = transaction.changes;
    for (let i = changes.length - 1; i >= 0; i--) {
      this._undoChange(changes[i]);
    }
    this._skipsUndoManager = false;

    this._fireStateChanged();
    this._fireTransactionEvent('FinishedUndo', transaction.name, transaction);
    return true;
  }

  redo(): boolean {
    if (!this._isEnabled || !this.hasRedo) return false;
    const transaction = this._redoStack.pop()!;
    this._undoStack.push(transaction);

    this._skipsUndoManager = true;
    const changes = transaction.changes;
    for (const change of changes) {
      this._redoChange(change);
    }
    this._skipsUndoManager = false;

    this._fireStateChanged();
    this._fireTransactionEvent('FinishedRedo', transaction.name, transaction);
    return true;
  }

  /** 清空历史 */
  clear(): void {
    this._undoStack.length = 0;
    this._redoStack.length = 0;
    this._currentTransaction = null;
    this._transactionLevel = 0;
    this._changes = [];
    this._nestedTransactionNames.length = 0;
    this._fireStateChanged();
  }

  private _undoChange(change: ChangedEvent): void {
    if (change.isPropertyChange) {
      if (change.object && change.propertyName) {
        if (this._model && typeof this._model.setDataProperty === 'function') {
          this._model.setDataProperty(change.object, change.propertyName, change.oldValue);
        } else {
          (change.object as any)[change.propertyName] = change.oldValue;
        }
      }
    } else if (change.isInsertChange) {
      if (change.object && change.propertyName) {
        const arr = (change.object as any)[change.propertyName];
        if (Array.isArray(arr)) {
          const data = arr[change.index];
          arr.splice(change.index, 1);
          if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
            const key = this._model.getKeyForNodeData(data);
            if (key !== undefined) (this._model as any)._keyMap.remove(key);
            this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'nodeDataArray', data, null, change.index);
          } else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
            this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'linkDataArray', data, null, change.index);
          }
        }
      }
    } else if (change.isRemoveChange) {
      if (change.object && change.propertyName) {
        const arr = (change.object as any)[change.propertyName];
        if (Array.isArray(arr)) {
          const data = change.oldValue;
          arr.splice(change.index, 0, data);
          if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
            const key = this._model.getKeyForNodeData(data);
            if (key !== undefined) (this._model as any)._keyMap.add(key, data);
            this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'nodeDataArray', null, data, change.index);
          } else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
            this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'linkDataArray', null, data, change.index);
          }
        }
      }
    }
  }

  private _redoChange(change: ChangedEvent): void {
    if (change.isPropertyChange) {
      if (change.object && change.propertyName) {
        if (this._model && typeof this._model.setDataProperty === 'function') {
          this._model.setDataProperty(change.object, change.propertyName, change.newValue);
        } else {
          (change.object as any)[change.propertyName] = change.newValue;
        }
      }
    } else if (change.isInsertChange) {
      if (change.object && change.propertyName) {
        const arr = (change.object as any)[change.propertyName];
        if (Array.isArray(arr)) {
          const data = change.newValue;
          arr.splice(change.index, 0, data);
          if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
            const key = this._model.getKeyForNodeData(data);
            if (key !== undefined) (this._model as any)._keyMap.add(key, data);
            this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'nodeDataArray', null, data, change.index);
          } else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
            this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'linkDataArray', null, data, change.index);
          }
        }
      }
    } else if (change.isRemoveChange) {
      if (change.object && change.propertyName) {
        const arr = (change.object as any)[change.propertyName];
        if (Array.isArray(arr)) {
          const data = arr[change.index];
          arr.splice(change.index, 1);
          if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
            const key = this._model.getKeyForNodeData(data);
            if (key !== undefined) (this._model as any)._keyMap.remove(key);
            this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'nodeDataArray', data, null, change.index);
          } else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
            this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'linkDataArray', data, null, change.index);
          }
        }
      }
    }
  }

  /** 修剪历史记录 */
  private _trimHistory(): void {
    if (this._maxHistory > 0) {
      while (this._undoStack.length > this._maxHistory) {
        this._undoStack.shift();
      }
    }
  }

  /** 添加状态变更监听器 */
  addStateChangedListener(listener: (manager: UndoManager) => void): void {
    this._stateChangedListeners.push(listener);
  }

  /** 移除状态变更监听器 */
  removeStateChangedListener(listener: (manager: UndoManager) => void): void {
    const idx = this._stateChangedListeners.indexOf(listener);
    if (idx >= 0) {
      this._stateChangedListeners.splice(idx, 1);
    }
  }

  private _fireStateChanged(): void {
    for (const listener of this._stateChangedListeners) {
      listener(this);
    }
  }

  private _fireTransactionEvent(propertyName: string, tname: string, transObj?: any): void {
    if (this._model && typeof this._model.raiseTransactionEvent === 'function') {
      this._model.raiseTransactionEvent(propertyName, tname, transObj);
    }
  }
  // ============ 官方 UndoManager API 对齐（阶段 5） ============

  private _models: any[] = [];
  private _nestedTransactionNames: string[] = [];
  private _checksTransactionLevel: boolean = false;
  private _isJustDiscarded: boolean = false;

  /** 官方 UndoManager.models：所有关联模型的迭代器 */
  get models(): Iterator<any> {
    return new List<any>(this._models).iterator;
  }

  /** 官方 UndoManager.addModel */
  addModel(model: any): void {
    if (model === null || model === undefined) return;
    if (this._models.indexOf(model) < 0) this._models.push(model);
  }

  /** 官方 UndoManager.removeModel */
  removeModel(model: any): void {
    const i = this._models.indexOf(model);
    if (i >= 0) this._models.splice(i, 1);
  }

  /**
   * 官方 UndoManager.history：已提交事务的历史。
   * 官方是一条 List（historyIndex 指向最近一次可撤销的事务）；
   * 本项目内部是 undo/redo 两个栈，这里按官方语义拼出等价快照：
   * 顺序 = 撤销栈正序 + 重做栈逆序。
   */
  get history(): List<Transaction> {
    const out: Transaction[] = this._undoStack.slice();
    for (let i = this._redoStack.length - 1; i >= 0; i--) out.push(this._redoStack[i]);
    return new List<Transaction>(out);
  }

  /** 官方 UndoManager.historyIndex：最近一条可撤销事务在 history 中的下标 */
  get historyIndex(): number {
    return this._undoStack.length - 1;
  }

  /** 官方 UndoManager.maxHistoryLength（本项目默认 0 表示不限长度，官方默认 999） */
  get maxHistoryLength(): number {
    return this._maxHistory;
  }
  set maxHistoryLength(value: number) {
    if (typeof value !== 'number' || isNaN(value)) return;
    this._maxHistory = value;
  }

  /** 官方 UndoManager.nestedTransactionNames */
  get nestedTransactionNames(): List<string> {
    return new List<string>(this._nestedTransactionNames);
  }

  /** 官方 UndoManager.checksTransactionLevel */
  get checksTransactionLevel(): boolean {
    return this._checksTransactionLevel;
  }
  set checksTransactionLevel(value: boolean) {
    this._checksTransactionLevel = value;
  }

  /** 官方 UndoManager.isUndoingRedoing：撤销/重放过程中为 true */
  get isUndoingRedoing(): boolean {
    return this._skipsUndoManager;
  }

  /** 官方 UndoManager.isJustDiscarded */
  get isJustDiscarded(): boolean {
    return this._isJustDiscarded;
  }

  /** 官方 UndoManager.discardHistoryAfterIndex：丢掉 historyIndex 之后（可重做）的事务 */
  discardHistoryAfterIndex(): void {
    if (this.isUndoingRedoing || !this.canRedo) return;
    while (this._redoStack.length > 0) {
      const t = this._redoStack.pop();
      if (t) t.clear();
      this._isJustDiscarded = true;
    }
  }

  /**
   * 官方 UndoManager.combineTransactions：把紧跟在 target 之后的那条事务
   * 的全部变更并入 target，并从历史里删掉它。不传 target 时合并最后两条。
   */
  combineTransactions(target?: Transaction): void {
    if (this.isUndoingRedoing) return;
    const hist = this._undoStack;
    if (hist.length < 2) return;
    let into: Transaction;
    let idx: number;
    if (target) {
      const k = hist.indexOf(target);
      if (k < 0) throw new Error('combineTransactions given unknown Transaction: ' + target);
      into = target;
      idx = k + 1;
    } else {
      into = hist[hist.length - 2];
      idx = hist.length - 1;
    }
    if (idx >= hist.length) return;
    const src = hist[idx];
    into.addAllChanges(src.changes);
    hist.splice(idx, 1);
  }

  /** 官方 UndoManager.copyProperties：只拷贝三个可配置属性 */
  copyProperties(other: UndoManager): void {
    this.isEnabled = other.isEnabled;
    this.maxHistoryLength = other.maxHistoryLength;
    this.checksTransactionLevel = other.checksTransactionLevel;
  }

  /** 官方 UndoManager.thaw：本项目历史是普通数组，无冻结语义，保持空实现 */
  thaw(): void {
    // no-op
  }

  /** 官方 UndoManager.skipsEvent：临时层对象与事务事件本身不进历史 */
  skipsEvent(e: ChangedEvent | null): boolean {
    if (e === null || e.change === ChangedEventTransaction) return true;
    const obj = e.object;
    if (obj === null || obj === undefined) return false;
    if (obj.layer !== undefined) {
      const layer = obj.layer;
      if (layer !== null && layer !== undefined && layer.isTemporary) return true;
    } else if (obj.isTemporary) {
      return true;
    }
    return false;
  }

  /** 官方 UndoManager.toString */
  toString(level?: number): string {
    const lv = level === undefined ? 0 : level;
    let str =
      'UndoManager ' + this.historyIndex + '<' + this.history.count + '<=' + this.maxHistoryLength;
    str += '[';
    const names = this.nestedTransactionNames;
    const n = names.count;
    for (let i = 0; i < n; i++) {
      if (i > 0) str += ' ';
      str += names.elt(i);
    }
    str += ']';
    if (lv > 0) {
      const hist = this.history;
      for (let i = 0; i < hist.count; i++) {
        const t = hist.elt(i);
        str += '\n ' + (t === null ? '' : t.toString());
      }
    }
    return str;
  }

}
