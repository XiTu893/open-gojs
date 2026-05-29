import { ChangedEvent } from './ChangedEvent';
import { ChangedEventTransaction } from '../core/EnumValues';

/**
 * Transaction - 事务
 * 组合多个 ChangedEvent，支持嵌套
 */
export class Transaction {
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
}
