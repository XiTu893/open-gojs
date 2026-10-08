/**
 * InputEvent - 输入事件
 * 封装鼠标/键盘/触摸事件信息
 */
export declare class InputEvent {
    static readonly className: string;
    /** 事件类型 */
    eventType: string;
    /** 文档坐标 X */
    documentPoint: {
        x: number;
        y: number;
    };
    /** 视图坐标 X */
    viewPoint: {
        x: number;
        y: number;
    };
    /** 修饰键状态 */
    alt: boolean;
    control: boolean;
    shift: boolean;
    meta: boolean;
    /** 鼠标按钮 */
    button: number;
    /** 按键代码 */
    key: string;
    /** 是否已处理 */
    handled: boolean;
    /** 原生事件 */
    nativeEvent: Event | null;
    /** 时间戳 */
    timestamp: number;
    /** 是否为右键 */
    isContextMenu: boolean;
    /** 点击次数 */
    clickCount: number;
    /** 滚轮增量 */
    delta: number;
    get leftButton(): boolean;
    get middleButton(): boolean;
    get rightButton(): boolean;
    constructor();
    /** 从鼠标事件初始化 */
    static fromMouseEvent(e: MouseEvent, diagram: any): InputEvent;
    /** 从键盘事件初始化 */
    static fromKeyboardEvent(e: KeyboardEvent): InputEvent;
    copy(): InputEvent;
    /**
     * 官方 InputEvent.bubbles
     * 当 InputEvent 作用于某个 GraphObject 并向其父级 Panel 冒泡时是否被处理。
     */
    bubbles: boolean;
    /**
     * 官方 InputEvent.targetObject（官方类型为 GraphObject | null）
     * 此处用 any 以避免与 view 层产生循环依赖。
     */
    targetObject: any;
    /**
     * 官方 InputEvent.event（本项目内部字段名为 nativeEvent）。
     */
    get event(): Event | null;
    set event(value: Event | null);
    /**
     * 官方 InputEvent.isTouchEvent
     * 是否为触摸事件。
     */
    get isTouchEvent(): boolean;
    /**
     * 官方 InputEvent.left
     * 逻辑左键是否被按住。
     * 若为 mousedown/mouseup 事件，使用 button；否则使用 buttons 的第 0 位。
     */
    get left(): boolean;
    set left(value: boolean);
    /** 官方 InputEvent.down —— 逻辑主键是否为按下状态。 */
    down: boolean;
    /** 官方 InputEvent.up —— 逻辑主键是否处于抬起状态。 */
    up: boolean;
    /**
     * 官方 InputEvent.isMultiTouch
     * 是否为多点触控（两个及以上触点同时作用于图）。
     */
    get isMultiTouch(): boolean;
}
