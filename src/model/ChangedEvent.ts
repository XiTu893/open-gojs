import { EnumValue, ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction } from '../core/EnumValues';

/**
 * ChangedEvent - 变更事件
 * 记录模型或图表的属性/插入/删除变更
 */
export class ChangedEvent {
  static readonly className: string = "ChangedEvent";
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
  /** 产生此事件的 Diagram（官方 ChangedEvent.diagram） */
  public diagram: any;
  /** 额外参数 */
  public parameter: any;
  /** 旧的附加参数（官方 ChangedEvent.oldParam） */
  public oldParam: any;
  /** 新的附加参数（官方 ChangedEvent.newParam） */
  public newParam: any;

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
    this.diagram = null;
    this.parameter = null;
    this.oldParam = null;
    this.newParam = null;
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
  // ============ 官方 ChangedEvent API 对齐（阶段 5） ============

  /** 官方 ChangedEvent.modelChange：模型数据级变更名（'nodeDataArray' / 'linkDataArray' / 'modelData.x'…） */
  public modelChange: string = '';

  /** @deprecated 官方静态别名，等价于 ChangeType.Transaction */
  static readonly Transaction: EnumValue = ChangedEventTransaction;
  /** @deprecated 官方静态别名，等价于 ChangeType.Property */
  static readonly Property: EnumValue = ChangedEventProperty;
  /** @deprecated 官方静态别名，等价于 ChangeType.Insert */
  static readonly Insert: EnumValue = ChangedEventInsert;
  /** @deprecated 官方静态别名，等价于 ChangeType.Remove */
  static readonly Remove: EnumValue = ChangedEventRemove;

  /** 官方 ChangedEvent.getValue：undo 取旧值，否则取新值 */
  getValue(undo: boolean): any {
    return undo ? this.oldValue : this.newValue;
  }

  /** 官方 ChangedEvent.getParam：undo 取旧参数，否则取新参数 */
  getParam(undo: boolean): any {
    return undo ? this.oldParam : this.newParam;
  }

  /** 官方 ChangedEvent.canUndo */
  canUndo(): boolean {
    return this.model !== null || this.diagram !== null;
  }

  /** 官方 ChangedEvent.undo：把对象状态倒回旧值 */
  undo(): void {
    if (!this.canUndo()) return;
    if (this.model !== null) {
      this.model.changeState(this, true);
    } else if (this.diagram !== null && typeof this.diagram.changeState === 'function') {
      this.diagram.changeState(this, true);
    }
  }

  /** 官方 ChangedEvent.canRedo */
  canRedo(): boolean {
    return this.model !== null || this.diagram !== null;
  }

  /** 官方 ChangedEvent.redo：把对象状态推进到新值 */
  redo(): void {
    if (!this.canRedo()) return;
    if (this.model !== null) {
      this.model.changeState(this, false);
    } else if (this.diagram !== null && typeof this.diagram.changeState === 'function') {
      this.diagram.changeState(this, false);
    }
  }

}
