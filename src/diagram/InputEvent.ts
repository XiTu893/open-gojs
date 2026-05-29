/**
 * InputEvent - 输入事件
 * 封装鼠标/键盘/触摸事件信息
 */
export class InputEvent {
  /** 事件类型 */
  public eventType: string;
  /** 文档坐标 X */
  public documentPoint: { x: number; y: number };
  /** 视图坐标 X */
  public viewPoint: { x: number; y: number };
  /** 修饰键状态 */
  public alt: boolean;
  public control: boolean;
  public shift: boolean;
  public meta: boolean;
  /** 鼠标按钮 */
  public button: number;
  /** 按键代码 */
  public key: string;
  /** 是否已处理 */
  public handled: boolean;
  /** 原生事件 */
  public nativeEvent: Event | null;
  /** 时间戳 */
  public timestamp: number;
  /** 是否为右键 */
  public isContextMenu: boolean;
  /** 点击次数 */
  public clickCount: number;
  /** 滚轮增量 */
  public delta: number;

  get leftButton(): boolean { return this.button === 0; }
  get middleButton(): boolean { return this.button === 1; }
  get rightButton(): boolean { return this.button === 2; }

  constructor() {
    this.eventType = '';
    this.documentPoint = { x: 0, y: 0 };
    this.viewPoint = { x: 0, y: 0 };
    this.alt = false;
    this.control = false;
    this.shift = false;
    this.meta = false;
    this.button = 0;
    this.key = '';
    this.handled = false;
    this.nativeEvent = null;
    this.timestamp = 0;
    this.isContextMenu = false;
    this.clickCount = 1;
    this.delta = 0;
  }

  /** 从鼠标事件初始化 */
  static fromMouseEvent(e: MouseEvent, diagram: any): InputEvent {
    const ie = new InputEvent();
    ie.nativeEvent = e;
    ie.alt = e.altKey;
    ie.control = e.ctrlKey;
    ie.shift = e.shiftKey;
    ie.meta = e.metaKey;
    ie.button = e.button;
    ie.timestamp = e.timeStamp;
    ie.clickCount = e.detail || 1;
    ie.viewPoint = { x: e.offsetX, y: e.offsetY };
    // 文档坐标需要通过 diagram 转换
    if (diagram) {
      const dp = diagram.transformViewToDoc({ x: e.offsetX, y: e.offsetY } as any);
      ie.documentPoint = { x: dp.x, y: dp.y };
    }
    return ie;
  }

  /** 从键盘事件初始化 */
  static fromKeyboardEvent(e: KeyboardEvent): InputEvent {
    const ie = new InputEvent();
    ie.nativeEvent = e;
    ie.alt = e.altKey;
    ie.control = e.ctrlKey;
    ie.shift = e.shiftKey;
    ie.meta = e.metaKey;
    ie.key = e.key;
    ie.timestamp = e.timeStamp;
    return ie;
  }

  copy(): InputEvent {
    const ie = new InputEvent();
    ie.eventType = this.eventType;
    ie.documentPoint = { ...this.documentPoint };
    ie.viewPoint = { ...this.viewPoint };
    ie.alt = this.alt;
    ie.control = this.control;
    ie.shift = this.shift;
    ie.meta = this.meta;
    ie.button = this.button;
    ie.key = this.key;
    ie.handled = this.handled;
    ie.timestamp = this.timestamp;
    ie.isContextMenu = this.isContextMenu;
    ie.clickCount = this.clickCount;
    ie.delta = this.delta;
    return ie;
  }
}
