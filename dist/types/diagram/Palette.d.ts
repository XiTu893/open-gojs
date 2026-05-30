import { Diagram } from './Diagram';
import { EnumValue } from '../core/EnumValues';
export declare class Palette extends Diagram {
    constructor(divId: string | HTMLDivElement);
    get isReadOnly(): boolean;
    set isReadOnly(_val: boolean);
    get allowSelect(): boolean;
    set allowSelect(val: boolean);
    get allowDragOut(): boolean;
    set allowDragOut(val: boolean);
    get allowMove(): boolean;
    set allowMove(_val: boolean);
    get allowDelete(): boolean;
    set allowDelete(_val: boolean);
    get allowCopy(): boolean;
    set allowCopy(_val: boolean);
    get autoScale(): EnumValue;
    set autoScale(val: EnumValue);
    copy(): Palette;
    private _setupPalette;
}
