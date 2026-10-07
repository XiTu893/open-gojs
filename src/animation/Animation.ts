import { Point } from '../core/Point';
import { Rect } from '../core/Rect';

export class Animation {
  static readonly className: string = "Animation";

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

  // ---- 官方 d.ts 的官方命名（EaseInOut / EaseIn / EaseOut 是本项目原来的别名，保留） ----
  static EaseInOutQuad(t: number): number { return Animation.EaseInOut(t); }
  static EaseInQuad(t: number): number { return Animation.EaseIn(t); }
  static EaseOutQuad(t: number): number { return Animation.EaseOut(t); }
  static EaseInExpo(t: number): number { return t === 0 ? 0 : Math.pow(2, 10 * (t - 1)); }
  static EaseOutExpo(t: number): number { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  private _isRunning: boolean = false;
  private _duration: number = NaN;
  private _easing: (t: number) => number = Animation.EaseInOut;
  private _reversible: boolean = false;
  /** 官方 `Animation.runCount`：跑几遍；Infinity 表示无限循环（belts 的传送带就是它） */
  private _runCount: number = 1;
  private _isViewportUnconstrained: boolean = false;
  private _state: AnimationState = AnimationState.Inactive;
  private _animations: AnimationConfig[] = [];
  private _startTime: number = 0;
  private _manager: any = null;
  private _finished: (() => void) | null = null;
  /** 官方 `Animation.rf`：start() 时临时挂进 diagram、stop() 时摘除的 Part 列表 */
  private _tempParts: any[] = [];
  /** 官方 `Animation.a`：addTemporaryPart 记录的目标 Diagram */
  private _tempDiagram: any = null;

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

  get runCount(): number {
    return this._runCount;
  }

  set runCount(val: number) {
    if (!(val > 0)) throw new Error('Animation.runCount value must be a positive integer.');
    this._runCount = val;
  }

  get isViewportUnconstrained(): boolean {
    return this._isViewportUnconstrained;
  }

  set isViewportUnconstrained(val: boolean) {
    this._isViewportUnconstrained = val;
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

  /**
   * 官方 `Animation.add(obj, effectName, startValue, endValue, cosmetic?): this`
   * （链式返回）。`from` 为 undefined 时用对象当前值当起点。
   */
  add(targetOrConfig: object | AnimationConfig, property?: string, fromValue?: any, toValue?: any): this {
    if (typeof targetOrConfig === 'object' && targetOrConfig !== null && property !== undefined) {
      const target: any = targetOrConfig;
      this._animations.push({
        target: targetOrConfig,
        property: property,
        from: fromValue !== undefined ? fromValue : target[property],
        to: toValue
      });
    } else {
      this._animations.push(targetOrConfig as AnimationConfig);
    }
    return this;
  }

  clear(): void {
    this._animations.length = 0;
    this._tempParts.length = 0;
    this._tempDiagram = null;
    this._isRunning = false;
    this._state = AnimationState.Inactive;
  }

  /**
   * 官方 `Animation.addTemporaryPart(part, diagram): this`：
   * 记录临时 Part（官方 `t.Oi()`：Part/Node 为 true，Link/Adornment 为 false），
   * start() 时 `part.data = null; diagram.add(part)`，stop() 时 `diagram.remove(part)`。
   */
  addTemporaryPart(part: any, diagram: any): this {
    if (!part) return this;
    const cn = part.constructor && part.constructor.className;
    if (cn === 'Link' || cn === 'Adornment') return this;
    this._tempParts.push(part);
    this._tempDiagram = diagram;
    return this;
  }

  /** 官方 `Animation.start(): this` —— 自己找到目标对象的 Diagram，取它的 animationManager 注册自己 */
  start(): this {
    if (this._isRunning) return this;
    if (this._animations.length === 0) return this;

    // 官方 go.js start()：遍历被动画的对象，取第一个能拿到 diagram 的，
    // 然后 `this.As = t.animationManager` 并注册自己。
    // 以前本项目只在 `animation.manager` 被显式赋值时注册，而样例从不赋值 ——
    // 于是 `new go.Animation() ... start()` 根本没人 tick，
    // belts 的传送带完全不动（`strokeDashOffset` 永远是初值）。
    let diagram: any = this._manager ? this._manager.diagram : null;
    if (diagram === null || diagram === undefined) diagram = this._tempDiagram;
    if (diagram === null || diagram === undefined) {
      for (const config of this._animations) {
        const t: any = config.target;
        if (!t) continue;
        if (t.className === 'Diagram') { diagram = t; break; }
        if (t.diagram) { diagram = t.diagram; break; }
        if (t.part && t.part.diagram) { diagram = t.part.diagram; break; }
      }
    }

    // 官方 start() 尾：`this.rf.each(s => { s.data = null; diagram.add(s) })`
    // （animatedFocus 的 focus1 副本就是此时才进 Tool 层的）
    if (diagram !== null && diagram !== undefined && this._tempParts.length > 0) {
      for (const p of this._tempParts) {
        p.data = null;
        if (!p.diagram) diagram.add(p);
      }
    }

    // 先置 isRunning 再注册：官方 start() 里 `this.Re=!0` 早于 `i.oO(this)`。
    // 顺序反了的话，registerAnimation 触发的第一次同步 tick 会因为
    // `isRunning===false` 把这个动画从 activeAnimations 里过滤掉，之后再没人 tick。
    this._isRunning = true;
    this._state = AnimationState.Running;
    this._startTime = performance.now();

    if (diagram !== null && diagram !== undefined) {
      const mgr = diagram.animationManager;
      if (mgr) {
        this._manager = mgr;
        if (typeof mgr.registerAnimation === 'function') mgr.registerAnimation(this);
      }
    } else if (this._manager && typeof this._manager.registerAnimation === 'function') {
      this._manager.registerAnimation(this);
    }

    if (this._manager && typeof this._manager.startAnimation === 'function') {
      this._manager.startAnimation();
    }
    return this;
  }

  stop(): this {
    if (!this._isRunning) return this;
    this._isRunning = false;
    this._state = AnimationState.Stopped;
    // 官方 stop()：`for (rf) diagram.remove(part)`（列表保留，restart 时再挂回）
    const dgm = this._tempDiagram;
    if (dgm) {
      for (const p of this._tempParts) {
        if (p.diagram) dgm.remove(p);
      }
    }
    if (this._manager && typeof this._manager.unregisterAnimation === 'function') {
      this._manager.unregisterAnimation(this);
    }
    return this;
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
    if (this._manager && typeof this._manager.unregisterAnimation === 'function') {
      this._manager.unregisterAnimation(this);
    }
    if (this._finished) {
      this._finished();
    }
  }

  restart(): void {
    for (const config of this._animations) {
      if (config.target && config.property) {
        this._setPropertyValue(config, config.from);
      }
    }
    this._isRunning = false;
    this.start();
  }

  update(now: number): void {
    if (!this._isRunning) return;

    // 官方：`this.Fs = isNaN(this.duration) ? manager.duration : this.duration`
    const mgrDur = this._manager && typeof this._manager.duration === 'number' ? this._manager.duration : 200;
    const dur = isNaN(this._duration) ? mgrDur : this._duration;

    const elapsed = now - this._startTime;
    const progress = Math.min(elapsed / dur, 1);

    const easedProgress = this._easing(progress);

    for (const config of this._animations) {
      if (config.target && config.property) {
        this._interpolate(config, easedProgress);
      }
    }

    if (progress >= 1) {
      // 官方 runCount 语义：>1 就再跑一遍（Infinity 无限循环），减到 0 才算 finished
      if (this._runCount > 1) {
        if (isFinite(this._runCount)) this._runCount--;
        // 下一轮从 from 重新开始。注意不能写成 `now - dur`：那样 elapsed 恒等于 dur，
        // progress 永远是 1，值会卡在 to 上不再动。
        this._startTime = now;
        return;
      }
      this._isRunning = false;
      this._state = AnimationState.Finished;
      for (const config of this._animations) {
        if (config.onFinish) {
          config.onFinish();
        }
      }
      if (this._manager && typeof this._manager.unregisterAnimation === 'function') {
        this._manager.unregisterAnimation(this);
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
