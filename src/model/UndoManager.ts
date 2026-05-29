import { Transaction } from './Transaction';
import { ChangedEvent } from './ChangedEvent';
import { ChangedEventTransaction } from '../core/EnumValues';

/**
 * UndoManager - 撤销管理器
 */
export class UndoManager {
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
    this._transactionLevel++;
    if (this._transactionLevel === 1) {
      this._currentTransaction = new Transaction(name);
      this._changes = [];
      this._fireTransactionEvent('StartingTransaction', name);
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
          arr.splice(change.index, 1);
        }
      }
    } else if (change.isRemoveChange) {
      if (change.object && change.propertyName) {
        const arr = (change.object as any)[change.propertyName];
        if (Array.isArray(arr)) {
          arr.splice(change.index, 0, change.oldValue);
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
          arr.splice(change.index, 0, change.newValue);
        }
      }
    } else if (change.isRemoveChange) {
      if (change.object && change.propertyName) {
        const arr = (change.object as any)[change.propertyName];
        if (Array.isArray(arr)) {
          arr.splice(change.index, 1);
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
}
