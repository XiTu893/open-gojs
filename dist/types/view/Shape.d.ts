import { GraphObject } from './GraphObject';
import { EnumValue } from '../core/EnumValues';
import { BrushLike } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { Spot } from '../core/Spot';
/**
 * Shape - 几何图形
 * 表示一个几何形状，支持预定义图形和自定义几何路径
 */
export declare class Shape extends GraphObject {
    static GeometryStretchUniform: EnumValue;
    static GeometryStretchNone: EnumValue;
    static GeometryStretchFill: EnumValue;
    static GeometryStretchUniformToFill: EnumValue;
    private _fill;
    private _stroke;
    private _strokeWidth;
    private _strokeDashArray;
    private _strokeDashOffset;
    private _strokeCap;
    private _strokeJoin;
    private _figure;
    private _geometry;
    private _geometryString;
    private _parameter1;
    private _parameter2;
    private _toArrow;
    private _fromArrow;
    private _geometryStretch;
    private _fillRule;
    constructor(figOrGeo?: string | Geometry | Partial<Shape>, init?: Partial<Shape>);
    get fill(): BrushLike;
    set fill(val: BrushLike);
    get stroke(): BrushLike;
    set stroke(val: BrushLike);
    get strokeWidth(): number;
    set strokeWidth(val: number);
    get strokeDashArray(): number[] | null;
    set strokeDashArray(val: number[] | null);
    get strokeDashOffset(): number;
    set strokeDashOffset(val: number);
    get strokeCap(): string;
    set strokeCap(val: string);
    get strokeJoin(): string;
    set strokeJoin(val: string);
    get geometryStretch(): EnumValue;
    set geometryStretch(val: EnumValue);
    get fillRule(): string;
    set fillRule(val: string);
    get figure(): string;
    set figure(val: string);
    get geometry(): Geometry | null;
    set geometry(val: Geometry | null);
    get geometryString(): string;
    set geometryString(val: string);
    get parameter1(): number;
    set parameter1(val: number);
    get parameter2(): number;
    set parameter2(val: number);
    private _spot1;
    private _spot2;
    get spot1(): Spot;
    set spot1(val: Spot);
    get spot2(): Spot;
    set spot2(val: Spot);
    get toArrow(): string;
    set toArrow(val: string);
    get fromArrow(): string;
    set fromArrow(val: string);
    /** 获取几何路径（从图形名称或自定义几何） */
    _getGeometry(): Geometry | null;
    private _getFigureGeometry;
    /** 测量对象尺寸 */
    _measure(widthConstraint: number, heightConstraint: number): void;
    /** 绘制图形 */
    _draw(ctx: CanvasRenderingContext2D): void;
    /** 在 canvas 上绘制几何路径 */
    private _drawGeometry;
    /** Draw an arc segment from current point to endpoint using SVG arc parameters */
    private _drawArcSegment;
    /** 复制 */
    copy(): Shape;
    static defineFigureGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void;
    static getFigureGenerators(): any;
    private static _arrowheadGeometries;
    static getArrowheadGeometries(): Record<string, Geometry>;
    static defineArrowheadGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void;
    private static _getArrowheadGeometry;
    private static _createArrowheadGeometries;
}
