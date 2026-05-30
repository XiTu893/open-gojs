import { Animation } from './Animation';
/**
 * AnimationTrigger - defines an animation that should run when a named property changes.
 */
export declare class AnimationTrigger {
    private _propertyName;
    private _animation;
    private _startsOn;
    get propertyName(): string;
    set propertyName(val: string);
    get animation(): Animation | null;
    set animation(val: Animation | null);
    get startsOn(): string;
    set startsOn(val: string);
    copy(): AnimationTrigger;
}
