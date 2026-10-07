export declare class Animation {
    static readonly className: string;
    static EaseLinear(t: number): number;
    static EaseInOut(t: number): number;
    static EaseIn(t: number): number;
    static EaseOut(t: number): number;
    static EaseInOutQuad(t: number): number;
    static EaseInQuad(t: number): number;
    static EaseOutQuad(t: number): number;
    static EaseInExpo(t: number): number;
    static EaseOutExpo(t: number): number;
    private _isRunning;
    private _duration;
    private _easing;
    private _reversible;
    /** 官方 `Animation.runCount`：跑几遍；Infinity 表示无限循环（belts 的传送带就是它） */
    private _runCount;
    private _isViewportUnconstrained;
    private _state;
    private _animations;
    private _startTime;
    private _manager;
    private _finished;
    /** 官方 `Animation.rf`：start() 时临时挂进 diagram、stop() 时摘除的 Part 列表 */
    private _tempParts;
    /** 官方 `Animation.a`：addTemporaryPart 记录的目标 Diagram */
    private _tempDiagram;
    get isRunning(): boolean;
    get duration(): number;
    set duration(val: number);
    get easing(): (t: number) => number;
    set easing(val: (t: number) => number);
    get reversible(): boolean;
    set reversible(val: boolean);
    get runCount(): number;
    set runCount(val: number);
    get isViewportUnconstrained(): boolean;
    set isViewportUnconstrained(val: boolean);
    get state(): string;
    get manager(): any;
    set manager(val: any);
    get finished(): (() => void) | null;
    set finished(val: (() => void) | null);
    /**
     * 官方 `Animation.add(obj, effectName, startValue, endValue, cosmetic?): this`
     * （链式返回）。`from` 为 undefined 时用对象当前值当起点。
     */
    add(targetOrConfig: object | AnimationConfig, property?: string, fromValue?: any, toValue?: any): this;
    clear(): void;
    /**
     * 官方 `Animation.addTemporaryPart(part, diagram): this`：
     * 记录临时 Part（官方 `t.Oi()`：Part/Node 为 true，Link/Adornment 为 false），
     * start() 时 `part.data = null; diagram.add(part)`，stop() 时 `diagram.remove(part)`。
     */
    addTemporaryPart(part: any, diagram: any): this;
    /** 官方 `Animation.start(): this` —— 自己找到目标对象的 Diagram，取它的 animationManager 注册自己 */
    start(): this;
    stop(): this;
    finish(): void;
    restart(): void;
    update(now: number): void;
    private _interpolate;
    private _setPropertyValue;
}
export declare enum AnimationState {
    Inactive = "Inactive",
    Running = "Running",
    Stopped = "Stopped",
    Finished = "Finished"
}
export interface AnimationConfig {
    target: object;
    property: string;
    from: any;
    to: any;
    onFinish?: () => void;
}
