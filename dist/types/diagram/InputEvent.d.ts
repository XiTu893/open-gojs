/**
 * InputEvent - 输入事件
 * 封装鼠标/键盘/触摸事件信息
 */
export declare class InputEvent {
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
}
