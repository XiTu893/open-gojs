import { Animation } from './Animation';
import { Set } from '../core/Set';
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
    /** 官方 `AnimationManager.defineAnimationEffect(effectName, animationFunction)`（静态） */
    static defineAnimationEffect(name: string, effect: (obj: object, from: any, to: any, duration: number) => Animation): void;
    static getEffect(name: string): ((obj: object, from: any, to: any, duration: number) => Animation) | undefined;
    updateAnimation(): void;
    private _startTicking;
    private _stopTicking;
    private _tick;
    private static _effects;
}
