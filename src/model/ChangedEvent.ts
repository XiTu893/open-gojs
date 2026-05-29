import { EnumValue, ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction } from '../core/EnumValues';

/**
 * ChangedEvent - 变更事件
 * 记录模型或图表的属性/插入/删除变更
 */
export class ChangedEvent {
  /** 变更类型 */
  public change: EnumValue;
  /** 变更主体对象 */
  public object: any;
  /** 属性名 */
  public propertyName: string;
  /** 旧值 */
  public oldValue: any;
  /** 新值 */
  public newValue: any;
  /** 索引（用于数组操作） */
  public index: number;
  /** 事务名称 */
  public transactionName: string;
  /** 是否来自模型 */
  public isModelChange: boolean;
  /** 产生此事件的 Model */
  public model: any;
  /** 额外参数 */
  public parameter: any;

  constructor();
  constructor(change: EnumValue, object: any, propertyName?: string, oldValue?: any, newValue?: any, index?: number);
  constructor(change?: EnumValue, object?: any, propertyName?: string, oldValue?: any, newValue?: any, index?: number) {
    this.change = change || ChangedEventProperty;
    this.object = object || null;
    this.propertyName = propertyName || '';
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.index = index || 0;
    this.transactionName = '';
    this.isModelChange = false;
    this.model = null;
    this.parameter = null;
  }

  /** 是否为属性变更 */
  get isPropertyChange(): boolean {
    return this.change === ChangedEventProperty;
  }

  /** 是否为插入变更 */
  get isInsertChange(): boolean {
    return this.change === ChangedEventInsert;
  }

  /** 是否为删除变更 */
  get isRemoveChange(): boolean {
    return this.change === ChangedEventRemove;
  }

  get isTransactionChange(): boolean {
    return this.change === ChangedEventTransaction;
  }

  get isTransactionFinished(): boolean {
    return this.change === ChangedEventTransaction &&
      (this.propertyName === 'CommittedTransaction' ||
       this.propertyName === 'RollbackTransaction' ||
       this.propertyName === 'FinishedUndo' ||
       this.propertyName === 'FinishedRedo');
  }

  /** 复制 */
  copy(): ChangedEvent {
    const e = new ChangedEvent(this.change, this.object, this.propertyName, this.oldValue, this.newValue, this.index);
    e.transactionName = this.transactionName;
    e.isModelChange = this.isModelChange;
    return e;
  }

  /** 重置 */
  clear(): void {
    this.change = ChangedEventProperty;
    this.object = null;
    this.propertyName = '';
    this.oldValue = undefined;
    this.newValue = undefined;
    this.index = 0;
    this.transactionName = '';
    this.isModelChange = false;
  }

  toString(): string {
    return `ChangedEvent(${this.change._name}, ${this.propertyName}, ${this.oldValue}, ${this.newValue})`;
  }
}
