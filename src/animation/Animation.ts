/**
 * Animation - represents a single animation that can animate properties of objects.
 */
export class Animation {

  // ============ Static Easing Functions ============

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

  // ============ Instance Properties ============

  private _isRunning: boolean = false;
  private _duration: number = 200;
  private _easing: (t: number) => number = Animation.EaseInOut;
  private _reversible: boolean = false;
  private _state: AnimationState = AnimationState.Inactive;
  private _animations: AnimationConfig[] = [];
  private _startTime: number = 0;
  private _frameId: number = 0;

  // ============ Properties ============

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

  // ============ Methods ============

  add(config: AnimationConfig): void {
    this._animations.push(config);
  }

  start(): void {
    if (this._isRunning) return;
    this._isRunning = true;
    this._state = AnimationState.Running;
    this._startTime = performance.now();
    this._tick();
  }

  stop(): void {
    if (!this._isRunning) return;
    this._isRunning = false;
    this._state = AnimationState.Stopped;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = 0;
    }
  }

  finish(): void {
    if (!this._isRunning) return;
    // Jump to end state
    for (const config of this._animations) {
      if (config.target && config.property) {
        (config.target as any)[config.property] = config.to;
      }
      if (config.onFinish) {
        config.onFinish();
      }
    }
    this._isRunning = false;
    this._state = AnimationState.Finished;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = 0;
    }
  }

  restart(): void {
    this.stop();
    // Reset to start state
    for (const config of this._animations) {
      if (config.target && config.property) {
        (config.target as any)[config.property] = config.from;
      }
    }
    this.start();
  }

  // ============ Internal Methods ============

  private _tick(): void {
    if (!this._isRunning) return;

    const elapsed = performance.now() - this._startTime;
    let progress = Math.min(elapsed / this._duration, 1);

    // Apply easing
    const easedProgress = this._easing(progress);

    // Update all animated properties
    for (const config of this._animations) {
      if (config.target && config.property) {
        const from = config.from;
        const to = config.to;
        const current = from + (to - from) * easedProgress;
        (config.target as any)[config.property] = current;
      }
    }

    if (progress < 1) {
      this._frameId = requestAnimationFrame(() => this._tick());
    } else {
      this._isRunning = false;
      this._state = AnimationState.Finished;
      this._frameId = 0;
      // Call finish callbacks
      for (const config of this._animations) {
        if (config.onFinish) {
          config.onFinish();
        }
      }
    }
  }
}

/**
 * Animation state enum values
 */
export enum AnimationState {
  Inactive = 'Inactive',
  Running = 'Running',
  Stopped = 'Stopped',
  Finished = 'Finished'
}

/**
 * Configuration for a single property animation
 */
export interface AnimationConfig {
  target: object;
  property: string;
  from: number;
  to: number;
  onFinish?: () => void;
}
