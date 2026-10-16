/**
 * InputEvent - 输入事件
 * 封装鼠标/键盘/触摸事件信息
 */
export class InputEvent {
  static readonly className: string = "InputEvent";
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
    /**
     * 官方 InputEvent.viewPoint = 客户端坐标减去 div 左上角。
     * 以前直接用 `offsetX/offsetY` —— 但拖拽期间的 mousemove/mouseup 是挂在
     * `document` 上的，`offsetX` 相对的是**光标下任意元素**（甚至在 canvas 外），
     * 于是拖动过程中 documentPoint 乱跳、节点被甩到随机位置。
     */
    const host: HTMLElement | null = diagram && diagram.div ? diagram.div : null;
    if (host && typeof (e as any).clientX === 'number') {
      const r = host.getBoundingClientRect();
      const vx = e.clientX - r.left;
      const vy = e.clientY - r.top;
      ie.viewPoint = { x: vx, y: vy };
      if (diagram) {
        const dp = diagram.transformViewToDoc({ x: vx, y: vy } as any);
        ie.documentPoint = { x: dp.x, y: dp.y };
      }
    } else {
      ie.viewPoint = { x: e.offsetX, y: e.offsetY };
      if (diagram) {
        const dp = diagram.transformViewToDoc({ x: e.offsetX, y: e.offsetY } as any);
        ie.documentPoint = { x: dp.x, y: dp.y };
      }
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
    ie.bubbles = this.bubbles;
    ie.targetObject = this.targetObject;
    ie.down = this.down;
    ie.up = this.up;
    return ie;
  }

  // ============ 官方 InputEvent API 对齐（阶段 6） ============

  /**
   * 官方 InputEvent.bubbles
   * 当 InputEvent 作用于某个 GraphObject 并向其父级 Panel 冒泡时是否被处理。
   */
  public bubbles: boolean = true;

  /**
   * 官方 InputEvent.targetObject（官方类型为 GraphObject | null）
   * 此处用 any 以避免与 view 层产生循环依赖。
   */
  public targetObject: any = null;

  /**
   * 官方 InputEvent.event（本项目内部字段名为 nativeEvent）。
   */
  get event(): Event | null { return this.nativeEvent; }
  set event(value: Event | null) { this.nativeEvent = value; }

  /**
   * 官方 InputEvent.isTouchEvent
   * 是否为触摸事件。
   */
  get isTouchEvent(): boolean {
    const e: any = this.nativeEvent;
    return e !== null && typeof e.type === 'string' && e.type.indexOf('touch') >= 0;
  }

  /**
   * 官方 InputEvent.left
   * 逻辑左键是否被按住。
   * 若为 mousedown/mouseup 事件，使用 button；否则使用 buttons 的第 0 位。
   */
  get left(): boolean {
    const e: any = this.nativeEvent;
    if (e !== null && (e.type === 'mouseup' || e.type === 'mousedown' || e.type === 'pointerup' || e.type === 'pointerdown')) return this.button === 0;
    if (e !== null && typeof e.buttons === 'number') return (e.buttons & 1) === 1;
    return this.button === 0;
  }
  set left(value: boolean) {
    const e: any = this.nativeEvent;
    if (e !== null && typeof e.buttons === 'number') {
      e.buttons = value ? (e.buttons | 1) : (e.buttons & ~1);
    }
    if (value && this.button !== 0) this.button = 0;
  }

  /** 官方 InputEvent.down —— 逻辑主键是否为按下状态。 */
  public down: boolean = false;

  /** 官方 InputEvent.up —— 逻辑主键是否处于抬起状态。 */
  public up: boolean = false;

  /**
   * 官方 InputEvent.right（ContextMenuTool.canStart 依赖它）：
   * down/up 事件用 button（mouseup 时 button===2 表示刚释放的是右键），
   * 其余事件用 buttons 的第 1 位。
   */
  get right(): boolean {
    const e: any = this.nativeEvent;
    if (e !== null && (e.type === 'mouseup' || e.type === 'mousedown' || e.type === 'pointerup' || e.type === 'pointerdown')) return this.button === 2;
    if (e !== null && typeof e.buttons === 'number') return (e.buttons & 2) === 2;
    return this.button === 2;
  }

  /** 官方 InputEvent.middle：同 right，button===1 / buttons 第 2 位。 */
  get middle(): boolean {
    const e: any = this.nativeEvent;
    if (e !== null && (e.type === 'mouseup' || e.type === 'mousedown' || e.type === 'pointerup' || e.type === 'pointerdown')) return this.button === 1;
    if (e !== null && typeof e.buttons === 'number') return (e.buttons & 4) === 4;
    return this.button === 1;
  }

  /**
   * 官方 InputEvent.isMultiTouch
   * 是否为多点触控（两个及以上触点同时作用于图）。
   */
  get isMultiTouch(): boolean {
    const e: any = this.nativeEvent;
    if (e === null) return false;
    if (typeof e.touches === 'object' && e.touches !== null && e.touches.length > 1) return true;
    if (typeof e.targetTouches === 'object' && e.targetTouches !== null && e.targetTouches.length > 1) return true;
    return false;
  }
}
