import { EnumValue } from '../core/EnumValues';
/**
 * RowColumnDefinition - defines the sizing and appearance of a row or column in a Table panel.
 */
export declare class RowColumnDefinition {
    private _row;
    private _column;
    private _height;
    private _width;
    private _minimum;
    private _maximum;
    private _sizing;
    private _separatorStroke;
    private _separatorStrokeWidth;
    private _separatorDashArray;
    private _background;
    private _coversSeparators;
    constructor();
    set(props: Record<string, any>): this;
    get row(): number;
    set row(val: number);
    get column(): number;
    set column(val: number);
    get height(): number;
    set height(val: number);
    get width(): number;
    set width(val: number);
    get minimum(): number;
    set minimum(val: number);
    get maximum(): number;
    set maximum(val: number);
    get sizing(): EnumValue;
    set sizing(val: EnumValue);
    get separatorStroke(): any;
    set separatorStroke(val: any);
    get separatorStrokeWidth(): number;
    set separatorStrokeWidth(val: number);
    get separatorDashArray(): number[] | null;
    set separatorDashArray(val: number[] | null);
    get background(): any;
    set background(val: any);
    get coversSeparators(): boolean;
    set coversSeparators(val: boolean);
    copy(): RowColumnDefinition;
}
