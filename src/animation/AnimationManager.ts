import { Animation } from './Animation';

/**
 * AnimationManager - manages all animations for a Diagram.
 * Controls whether animations are enabled, their default duration,
 * and the overall animation tick loop.
 */
export class AnimationManager {

  private _diagram: any = null;
  private _isEnabled: boolean = true;
  private _duration: number = 200;
  private _isAnimating: boolean = false;
  private _isInitial: boolean = true;
  private _isTicking: boolean = false;
  private _activeAnimations: Animation[] = [];
  private _frameId: number = 0;

  // ============ Properties ============

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

  // ============ Methods ============

  startAnimation(): void {
    if (!this._isEnabled) return;
    if (this._isAnimating) return;
    this._isAnimating = true;
    this._isInitial = false;
    this._startTicking();
  }

  stopAnimation(): void {
    if (!this._isAnimating) return;
    this._isAnimating = false;
    // Stop all active animations
    for (const anim of this._activeAnimations) {
      anim.stop();
    }
    this._activeAnimations = [];
    this._stopTicking();
  }

  defineAnimationEffect(name: string, effect: (obj: object, from: number, to: number, duration: number) => Animation): void {
    (AnimationManager as any)._effects[name] = effect;
  }

  updateAnimation(): void {
    if (!this._isAnimating) return;
    // Remove finished animations
    this._activeAnimations = this._activeAnimations.filter(a => a.isRunning);
    if (this._activeAnimations.length === 0) {
      this._isAnimating = false;
      this._stopTicking();
    }
  }

  // ============ Internal Methods ============

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

  // ============ Static ============

  private static _effects: Record<string, (obj: object, from: number, to: number, duration: number) => Animation> = {};
}
