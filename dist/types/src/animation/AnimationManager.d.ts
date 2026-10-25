import { Animation } from './Animation';
import { Set } from '../core/Set';
/** 官方自定义动画效果函数签名。easing 是官方 4 参 `(time, start, delta, duration) => value`。 */
export type AnimationEffectFn = (obj: object, from: any, to: any, easing: (time: number, start: number, delta: number, duration: number) => number, currentTime: number, duration: number, animation: Animation) => void;
export declare class AnimationManager {
    static readonly className: string;
    private _diagram;
    private _isEnabled;
    private _duration;
    private _isAnimating;
    private _isInitial;
    private _isTicking;
    private _activeAnimations;
    private _frameId;
    private _defaultAnimation;
    get diagram(): any;
    set diagram(val: any);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get duration(): number;
    set duration(val: number);
    get isAnimating(): boolean;
    get isInitial(): boolean;
    set isInitial(val: boolean);
    get isTicking(): boolean;
    get defaultAnimation(): Animation;
    private _createDefaultAnimation;
    startAnimation(anim?: Animation): void;
    stopAnimation(): void;
    registerAnimation(anim: Animation): void;
    /** 官方对应 `AnimationManager` 内部把动画从活动列表里摘掉的动作（go.js 里是 `oO` 的反向） */
    unregisterAnimation(anim: Animation): void;
    /** 官方 `AnimationManager.activeAnimations: Set<Animation>` */
    get activeAnimations(): Set<Animation>;
    /** 官方 `AnimationManager.defineAnimationEffect(effectName, animationFunction)`（静态）
     * 官方效果函数签名：`(obj, from, to, easing, currentTime, duration, animation) => void`，
     * easing 是 4 参 `(time, start, delta, duration) => value`。 */
    static defineAnimationEffect(name: string, effect: AnimationEffectFn): void;
    static getEffect(name: string): AnimationEffectFn | undefined;
    updateAnimation(): void;
    private _startTicking;
    private _stopTicking;
    private _tick;
    private static _effects;
}
