import { Animation } from './Animation';

/**
 * AnimationTrigger - defines an animation that should run when a named property changes.
 */
export class AnimationTrigger {

  private _propertyName: string = '';
  private _animation: Animation | null = null;
  private _startsOn: string = 'changed';

  // ============ Properties ============

  get propertyName(): string {
    return this._propertyName;
  }

  set propertyName(val: string) {
    this._propertyName = val;
  }

  get animation(): Animation | null {
    return this._animation;
  }

  set animation(val: Animation | null) {
    this._animation = val;
  }

  get startsOn(): string {
    return this._startsOn;
  }

  set startsOn(val: string) {
    this._startsOn = val;
  }

  // ============ Methods ============

  copy(): AnimationTrigger {
    const trigger = new AnimationTrigger();
    trigger.propertyName = this._propertyName;
    trigger.startsOn = this._startsOn;
    if (this._animation) {
      trigger.animation = new Animation();
      trigger.animation.duration = this._animation.duration;
      trigger.animation.easing = this._animation.easing;
      trigger.animation.reversible = this._animation.reversible;
    }
    return trigger;
  }
}
