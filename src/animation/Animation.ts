import { Point } from '../core/Point';
import { Rect } from '../core/Rect';

export class Animation {

  static EaseLinear(t: number): number {
    return t;
  }

  static EaseInOut(t: number): number {
    if (t < 0.5) {
      return 2 * t * t;
    }
    return -1 + (4 - 2 * t) * t;
  }

  static EaseIn(t: number): number {
    return t * t;
  }

  static EaseOut(t: number): number {
    return t * (2 - t);
  }

  private _isRunning: boolean = false;
  private _duration: number = 200;
  private _easing: (t: number) => number = Animation.EaseInOut;
  private _reversible: boolean = false;
  private _state: AnimationState = AnimationState.Inactive;
  private _animations: AnimationConfig[] = [];
  private _startTime: number = 0;
  private _manager: any = null;
  private _finished: (() => void) | null = null;

  get isRunning(): boolean {
    return this._isRunning;
  }

  get duration(): number {
    return this._duration;
  }

  set duration(val: number) {
    this._duration = val;
  }

  get easing(): (t: number) => number {
    return this._easing;
  }

  set easing(val: (t: number) => number) {
    this._easing = val;
  }

  get reversible(): boolean {
    return this._reversible;
  }

  set reversible(val: boolean) {
    this._reversible = val;
  }

  get state(): string {
    return this._state;
  }

  get manager(): any {
    return this._manager;
  }

  set manager(val: any) {
    this._manager = val;
  }

  get finished(): (() => void) | null {
    return this._finished;
  }

  set finished(val: (() => void) | null) {
    this._finished = val;
  }

  add(targetOrConfig: object | AnimationConfig, property?: string, fromValue?: any, toValue?: any): void {
    if (typeof targetOrConfig === 'object' && property !== undefined) {
      this._animations.push({
        target: targetOrConfig,
        property: property,
        from: fromValue,
        to: toValue
      });
    } else {
      this._animations.push(targetOrConfig as AnimationConfig);
    }
  }

  start(): void {
    if (this._isRunning) return;
    this._isRunning = true;
    this._state = AnimationState.Running;
    this._startTime = performance.now();
    if (this._manager && typeof this._manager.registerAnimation === 'function') {
      this._manager.registerAnimation(this);
    }
  }

  stop(): void {
    if (!this._isRunning) return;
    this._isRunning = false;
    this._state = AnimationState.Stopped;
  }

  finish(): void {
    if (!this._isRunning) return;
    for (const config of this._animations) {
      if (config.target && config.property) {
        this._setPropertyValue(config, config.to);
      }
      if (config.onFinish) {
        config.onFinish();
      }
    }
    this._isRunning = false;
    this._state = AnimationState.Finished;
    if (this._finished) {
      this._finished();
    }
  }

  restart(): void {
    this.stop();
    for (const config of this._animations) {
      if (config.target && config.property) {
        this._setPropertyValue(config, config.from);
      }
    }
    this.start();
  }

  update(now: number): void {
    if (!this._isRunning) return;

    const elapsed = now - this._startTime;
    let progress = Math.min(elapsed / this._duration, 1);

    const easedProgress = this._easing(progress);

    for (const config of this._animations) {
      if (config.target && config.property) {
        this._interpolate(config, easedProgress);
      }
    }

    if (progress >= 1) {
      this._isRunning = false;
      this._state = AnimationState.Finished;
      for (const config of this._animations) {
        if (config.onFinish) {
          config.onFinish();
        }
      }
      if (this._finished) {
        this._finished();
      }
    }
  }

  private _interpolate(config: AnimationConfig, t: number): void {
    const from = config.from;
    const to = config.to;

    if (from instanceof Point && to instanceof Point) {
      const current = new Point(
        from.x + (to.x - from.x) * t,
        from.y + (to.y - from.y) * t
      );
      (config.target as any)[config.property] = current;
    } else if (from instanceof Rect && to instanceof Rect) {
      const current = new Rect(
        from.x + (to.x - from.x) * t,
        from.y + (to.y - from.y) * t,
        from.width + (to.width - from.width) * t,
        from.height + (to.height - from.height) * t
      );
      (config.target as any)[config.property] = current;
    } else if (typeof from === 'number' && typeof to === 'number') {
      const current = from + (to - from) * t;
      (config.target as any)[config.property] = current;
    } else {
      if (t >= 1) {
        (config.target as any)[config.property] = to;
      }
    }
  }

  private _setPropertyValue(config: AnimationConfig, value: any): void {
    if (value instanceof Point) {
      (config.target as any)[config.property] = value.copy();
    } else if (value instanceof Rect) {
      (config.target as any)[config.property] = value.copy();
    } else {
      (config.target as any)[config.property] = value;
    }
  }
}

export enum AnimationState {
  Inactive = 'Inactive',
  Running = 'Running',
  Stopped = 'Stopped',
  Finished = 'Finished'
}

export interface AnimationConfig {
  target: object;
  property: string;
  from: any;
  to: any;
  onFinish?: () => void;
}
