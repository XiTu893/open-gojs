import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
export declare class Placeholder extends GraphObject {
    private _padding;
    constructor(init?: Partial<Placeholder>);
    get padding(): number;
    set padding(val: number);
    get _placeholderBounds(): Rect;
    _measure(availW: number, availH: number): void;
    _arrange(bounds: Rect): void;
    private _findGroup;
    copy(): Placeholder;
}
