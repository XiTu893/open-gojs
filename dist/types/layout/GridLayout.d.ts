import { Size } from '../core/Size';
import { EnumValue } from '../core/EnumValues';
import { Layout } from './Layout';
/**
 * GridLayout - arranges parts in a grid pattern.
 */
export declare class GridLayout extends Layout {
    private _wrappingWidth;
    private _cellSize;
    private _spacing;
    private _alignment;
    private _arrangement;
    private _sorting;
    get wrappingWidth(): number;
    set wrappingWidth(val: number);
    get cellSize(): Size;
    set cellSize(val: Size);
    get spacing(): Size;
    set spacing(val: Size);
    get alignment(): EnumValue;
    set alignment(val: EnumValue);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get sorting(): EnumValue;
    set sorting(val: EnumValue);
    copy(): GridLayout;
    doLayout(coll: any): void;
    private _sortNodes;
    static Location: EnumValue;
    static Center: EnumValue;
    static Forwards: EnumValue;
    static Reverse: EnumValue;
    static Ascending: EnumValue;
    static Descending: EnumValue;
    static Position: EnumValue;
    static smartComparer(a: any, b: any): number;
}
