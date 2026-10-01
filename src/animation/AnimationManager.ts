import { Animation } from './Animation';
import { Set } from '../core/Set';

export class AnimationManager {
  static readonly className: string = "AnimationManager";

  private _diagram: any = null;
  private _isEnabled: boolean = true;
  private _duration: number = 200;
  private _isAnimating: boolean = false;
  private _isInitial: boolean = true;
  private _isTicking: boolean = false;
  private _activeAnimations: Animation[] = [];
  private _frameId: number = 0;
  private _defaultAnimation: Animation | null = null;

  get diagram(): any {
    return this._diagram;
  }

  set diagram(val: any) {
    this._diagram = val;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  set isEnabled(val: boolean) {
    this._isEnabled = val;
    if (!val) {
      this.stopAnimation();
    }
  }

  get duration(): number {
    return this._duration;
  }

  set duration(val: number) {
    this._duration = val;
  }

  get isAnimating(): boolean {
    return this._isAnimating;
  }

  get isInitial(): boolean {
    return this._isInitial;
  }

  set isInitial(val: boolean) {
    this._isInitial = val;
  }

  get isTicking(): boolean {
    return this._isTicking;
  }

  get defaultAnimation(): Animation {
    if (!this._defaultAnimation) {
      this._defaultAnimation = this._createDefaultAnimation();
    }
    return this._defaultAnimation;
  }

  private _createDefaultAnimation(): Animation {
    const anim = new Animation();
    anim.duration = this._duration;
    anim.manager = this;
    return anim;
  }

  startAnimation(anim?: Animation): void {
    if (!this._isEnabled) return;
    if (anim) {
      this.registerAnimation(anim);
    }
    if (this._isAnimating) return;
    this._isAnimating = true;
    this._isInitial = false;
    this._startTicking();
  }

  stopAnimation(): void {
    if (!this._isAnimating) return;
    this._isAnimating = false;
    for (const anim of this._activeAnimations) {
      anim.stop();
    }
    this._activeAnimations = [];
    this._stopTicking();
  }

  registerAnimation(anim: Animation): void {
    if (this._activeAnimations.indexOf(anim) < 0) {
      this._activeAnimations.push(anim);
    }
    anim.manager = this;
    if (!this._isAnimating && this._isEnabled) {
      this._isAnimating = true;
      this._isInitial = false;
      this._startTicking();
    }
  }

  /** 官方对应 `AnimationManager` 内部把动画从活动列表里摘掉的动作（go.js 里是 `oO` 的反向） */
  unregisterAnimation(anim: Animation): void {
    const i = this._activeAnimations.indexOf(anim);
    if (i >= 0) this._activeAnimations.splice(i, 1);
  }

  /** 官方 `AnimationManager.activeAnimations: Set<Animation>` */
  get activeAnimations(): Set<Animation> {
    const s = new Set<Animation>();
    for (const a of this._activeAnimations) s.add(a);
    return s;
  }

  /** 官方 `AnimationManager.defineAnimationEffect(effectName, animationFunction)`（静态） */
  static defineAnimationEffect(name: string, effect: (obj: object, from: any, to: any, duration: number) => Animation): void {
    (AnimationManager as any)._effects[name] = effect;
  }

  static getEffect(name: string): ((obj: object, from: any, to: any, duration: number) => Animation) | undefined {
    return (AnimationManager as any)._effects[name];
  }

  updateAnimation(): void {
    if (!this._isAnimating) return;
    const now = performance.now();
    for (const anim of this._activeAnimations) {
      if (anim.isRunning) {
        anim.update(now);
      }
    }
    this._activeAnimations = this._activeAnimations.filter(a => a.isRunning);
    if (this._activeAnimations.length === 0) {
      this._isAnimating = false;
      this._stopTicking();
    }
    if (this._diagram && typeof this._diagram.requestUpdate === 'function') {
      this._diagram.requestUpdate();
    }
  }

  private _startTicking(): void {
    if (this._isTicking) return;
    this._isTicking = true;
    // 官方是 rAF 驱动的；这里原来**同步**先跑一次 updateAnimation()，
    // 会在 registerAnimation 内部把刚加进来的动画（此刻可能还没置 isRunning）
    // 当成「已结束」过滤掉，然后立刻停摆。改成排到下一帧。
    this._frameId = requestAnimationFrame(() => this._tick());
  }

  private _stopTicking(): void {
    this._isTicking = false;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = 0;
    }
  }

  private _tick(): void {
    if (!this._isTicking) return;
    this.updateAnimation();
    if (this._isTicking) {
      this._frameId = requestAnimationFrame(() => this._tick());
    }
  }

  private static _effects: Record<string, (obj: object, from: any, to: any, duration: number) => Animation> = {};
}
