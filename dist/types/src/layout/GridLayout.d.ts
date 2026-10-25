import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { EnumValue } from '../core/EnumValues';
import { Part } from '../view/Part';
import { Layout } from './Layout';
/**
 * GridLayout - arranges parts in a grid pattern.
 * 官方 GridLayout（pretty.js 31840）：sorting 默认 Ascending(comparer=standardComparer，按 part.text)、
 * alignment 默认 Location(I4)、arrangement 默认 LeftToRight、cellSize 默认 (NaN,NaN)、spacing (10,10)、
 * wrappingWidth NaN → viewportBounds.width - padding。
 */
export declare class GridLayout extends Layout {
    static readonly className: string;
    private _wrappingWidth;
    private _wrappingColumn;
    private _cellSize;
    private _spacing;
    private _alignment;
    private _arrangement;
    private _sorting;
    private _comparer;
    /** 官方 GridLayout 构造：默认 isViewportSized=true，`t && Object.assign(this, t)` */
    constructor(init?: any);
    /** 官方 setter：只接受 >0 或 NaN；wrappingWidth 决定 isViewportSized = isNaN(t) */
    get wrappingWidth(): number;
    set wrappingWidth(val: number);
    get wrappingColumn(): number;
    set wrappingColumn(val: number);
    get comparer(): ((a: any, b: any) => number) | null;
    set comparer(val: ((a: any, b: any) => number) | null);
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
    /** 官方 GridLayout.doLayout（pretty.js 31866） */
    doLayout(coll: any): void;
    /** 官方 GridAlignment.Position 分支 R4（pretty.js 31927） */
    private _layoutPosition;
    /** 官方 GridAlignment.Location 分支 I4（pretty.js 31957，默认） */
    private _layoutLocation;
    commitLayers(grid: any, origin: Point): void;
    static Location: EnumValue;
    static Center: EnumValue;
    static Forwards: EnumValue;
    static Forward: EnumValue;
    static Reverse: EnumValue;
    static Ascending: EnumValue;
    static Descending: EnumValue;
    static Position: EnumValue;
    static LeftToRight: EnumValue;
    static RightToLeft: EnumValue;
    /** 官方 GridLayout.standardComparer：按 part.text 比较 */
    static standardComparer(a: Part, b: Part): number;
    /** 官方 GridLayout.smartComparer：按 part.text 忽略大小写并数字感知比较 */
    static smartComparer(a: Part, b: Part): number;
}
