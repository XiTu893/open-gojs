import { Animation } from './Animation';

export class AnimationManager {

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

  defineAnimationEffect(name: string, effect: (obj: object, from: any, to: any, duration: number) => Animation): void {
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
    this._tick();
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
