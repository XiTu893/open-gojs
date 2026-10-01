import { ChangedEvent } from './ChangedEvent';
import { ChangedEventTransaction, ChangedEventProperty } from '../core/EnumValues';

/**
 * Transaction - 事务
 * 组合多个 ChangedEvent，支持嵌套
 */
export class Transaction {
  static readonly className: string = "Transaction";
  public name: string;
  private _changes: ChangedEvent[];
  private _level: number;
  private _nestedNames: string[];

  constructor(name: string = '') {
    this.name = name;
    this._changes = [];
    this._level = 0;
    this._nestedNames = [];
  }

  get changes(): ChangedEvent[] {
    return this._changes;
  }

  get level(): number {
    return this._level;
  }

  get nestedNames(): string[] {
    return this._nestedNames;
  }

  addNestedName(name: string): void {
    if (name) this._nestedNames.push(name);
  }

  /** 添加变更事件 */
  addChange(change: ChangedEvent): void {
    this._changes.push(change);
  }

  begin(): void {
    this._level++;
  }

  end(): void {
    this._level--;
  }

  /** 是否已完成（无嵌套） */
  get isComplete(): boolean {
    return this._level <= 0;
  }

  /** 变更数量 */
  get count(): number {
    return this._changes.length;
  }

  clear(): void {
    this._changes.length = 0;
    this._level = 0;
    this._nestedNames.length = 0;
  }

  copy(): Transaction {
    const t = new Transaction(this.name);
    t._changes = this._changes.map(c => c.copy());
    t._level = this._level;
    t._nestedNames = this._nestedNames.slice();
    return t;
  }

  toString(): string {
    return `Transaction(${this.name}, ${this._changes.length} changes)`;
  }
  // ============ 官方 Transaction API 对齐（阶段 5） ============

  /** 官方 Transaction.canUndo：事务完整才可撤销 */
  canUndo(): boolean {
    return this.isComplete;
  }

  /** 官方.Transaction.undo：倒序回放所有变更 */
  undo(): void {
    if (!this.canUndo()) return;
    for (let i = this._changes.length - 1; i >= 0; i--) {
      const e = this._changes[i];
      if (e) e.undo();
    }
  }

  /** 官方 Transaction.canRedo */
  canRedo(): boolean {
    return this.isComplete;
  }

  /** 官方 Transaction.redo：正序重放所有变更 */
  redo(): void {
    if (!this.canRedo()) return;
    for (let i = 0; i < this._changes.length; i++) {
      const e = this._changes[i];
      if (e) e.redo();
    }
  }

  /** 官方 Transaction.thaw：本项目的 changes 是普通数组，无冻结语义，保持空实现 */
  thaw(): void {
    // no-op
  }

  /**
   * 官方 Transaction.optimize：把同一对象同一属性的连续 Property 变更合并成最后一条。
   * 官方实现先把被合并项置为 null 再压紧数组；这里等价地重建数组，避免数组里出现 null。
   */
  optimize(): void {
    if (!this.isComplete) return;
    const changes = this._changes;
    const lastIndexByKey = new Map<any, Map<string, number>>();
    const dropped: boolean[] = [];
    for (let i = 0; i < changes.length; i++) {
      dropped.push(false);
      const e = changes[i];
      if (!e || e.change !== ChangedEventProperty || !e.object) continue;
      let byProp = lastIndexByKey.get(e.object);
      if (byProp === undefined) {
        byProp = new Map<string, number>();
        lastIndexByKey.set(e.object, byProp);
      }
      const prev = byProp.get(e.propertyName);
      if (prev === undefined) {
        byProp.set(e.propertyName, i);
      } else {
        if (prev >= 0) dropped[prev] = true;
        byProp.set(e.propertyName, i);
      }
    }
    const kept: ChangedEvent[] = [];
    for (let i = 0; i < changes.length; i++) {
      if (!dropped[i]) kept.push(changes[i]);
    }
    changes.length = 0;
    for (let i = 0; i < kept.length; i++) changes.push(kept[i]);
  }

  /** 官方 Transaction.WI：把另一份变更列表追加到本事务尾部 */
  addAllChanges(changes: ChangedEvent[]): void {
    for (let i = 0; i < changes.length; i++) this._changes.push(changes[i]);
  }

}
