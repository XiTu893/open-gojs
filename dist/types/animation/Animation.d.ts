export declare class Animation {
    static EaseLinear(t: number): number;
    static EaseInOut(t: number): number;
    static EaseIn(t: number): number;
    static EaseOut(t: number): number;
    private _isRunning;
    private _duration;
    private _easing;
    private _reversible;
    private _state;
    private _animations;
    private _startTime;
    private _manager;
    private _finished;
    get isRunning(): boolean;
    get duration(): number;
    set duration(val: number);
    get easing(): (t: number) => number;
    set easing(val: (t: number) => number);
    get reversible(): boolean;
    set reversible(val: boolean);
    get state(): string;
    get manager(): any;
    set manager(val: any);
    get finished(): (() => void) | null;
    set finished(val: (() => void) | null);
    add(targetOrConfig: object | AnimationConfig, property?: string, fromValue?: any, toValue?: any): void;
    clear(): void;
    start(): void;
    stop(): void;
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
