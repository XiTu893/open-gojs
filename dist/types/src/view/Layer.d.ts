import { List } from '../core/List';
import { Iterator } from '../core/Iterable';
import { Point } from '../core/Point';
import type { Rect } from '../core/Rect';
import { Set as GSet } from '../core/Set';
import type { Part } from './Part';
import type { GraphObject } from './GraphObject';
/**
 * Layer - 图层
 * 控制绘制顺序和可见性
 *
 * 对照 `go.d.ts` 的 `export class Layer`（10441 行起）。
 * 偏差：官方 Layer 内部维护一个 Quadtree（`Hr`）做空间索引，
 * 本项目直接按 `parts` 反向顺序线性扫描，结果语义一致、仅性能不同。
 */
export declare class Layer {
    static readonly className: string;
    private _name;
    private _opacity;
    private _visible;
    private _isTemporary;
    private _isViewportAligned;
    private _isInDocumentBounds;
    private _pickable;
    private _allowCopy;
    private _allowDelete;
    private _allowTextEdit;
    private _allowGroup;
    private _allowUngroup;
    private _allowLink;
    private _allowRelink;
    private _allowMove;
    private _allowReshape;
    private _allowResize;
    private _allowRotate;
    private _allowSelect;
    /** Z 序（本项目扩展，官方无此属性） */
    zIndex: number;
    /** 所属 Diagram */
    private _diagram;
    /** 图层中的 Part 集合 */
    private _parts;
    constructor(init?: Partial<Layer>);
    /** 官方 Layer 的属性变更通知（`Diagram.raiseChangedEvent(ChangedEvent.Property, ...)`） */
    private _raiseChanged;
    /**
     * 官方 `Layer.findObjectAt(p, navig, pred)`（go.d.ts:10461）。
     * `p` 是**文档坐标**；`navig` 把命中的对象映射成结果类型，`pred` 再过滤。
     */
    findObjectAt<T extends GraphObject>(p: Point, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null): T | null;
    /** 官方 `Layer.findObjectsAt(p, navig, pred, coll)`（go.d.ts:10480）。 */
    findObjectsAt<T extends GraphObject, S extends List<T> | GSet<T> = GSet<T>>(p: Point, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null, coll?: S): S;
    /** 官方 `Layer.findObjectsIn(r, navig, pred, partialInclusion, coll)`（go.d.ts:10499）。 */
    findObjectsIn<T extends GraphObject, S extends List<T> | GSet<T> = GSet<T>>(r: Rect, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null, partialInclusion?: boolean, coll?: S): S;
    /** 官方 `Layer.findObjectsNear(p, dist, navig, pred, partialInclusion, coll)`（go.d.ts:10522）。 */
    findObjectsNear<T extends GraphObject, S extends List<T> | GSet<T> = GSet<T>>(p: Point, dist: number, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null, partialInclusion?: boolean | S, coll?: S): S;
    /** 生成官方 `navig → pred → coll.add` 的回调。 */
    private static _collector;
    get parts(): Iterator<Part>;
    get partsBackwards(): Iterator<Part>;
    get partsCount(): number;
    get diagram(): any;
    set diagram(val: any);
    get name(): string;
    set name(val: string);
    get opacity(): number;
    set opacity(val: number);
    get isViewportAligned(): boolean;
    set isViewportAligned(val: boolean);
    get isTemporary(): boolean;
    set isTemporary(val: boolean);
    get visible(): boolean;
    set visible(val: boolean);
    get pickable(): boolean;
    set pickable(val: boolean);
    get isInDocumentBounds(): boolean;
    set isInDocumentBounds(val: boolean);
    get allowCopy(): boolean;
    set allowCopy(val: boolean);
    get allowDelete(): boolean;
    set allowDelete(val: boolean);
    get allowTextEdit(): boolean;
    set allowTextEdit(val: boolean);
    get allowGroup(): boolean;
    set allowGroup(val: boolean);
    get allowUngroup(): boolean;
    set allowUngroup(val: boolean);
    get allowLink(): boolean;
    set allowLink(val: boolean);
    get allowRelink(): boolean;
    set allowRelink(val: boolean);
    get allowMove(): boolean;
    set allowMove(val: boolean);
    get allowReshape(): boolean;
    set allowReshape(val: boolean);
    get allowResize(): boolean;
    set allowResize(val: boolean);
    get allowRotate(): boolean;
    set allowRotate(val: boolean);
    get allowSelect(): boolean;
    set allowSelect(val: boolean);
    /**
     * 官方 `Layer.toString(details?: number)`（运行时实现，go.d.ts 未声明）。
     * `details <= 0` → `Layer "<name>"`；`> 0` 追加计数；`> 1` 再逐个列出 Part。
     */
    toString(details?: number): string;
    /** 添加 Part */
    add(part: any): void;
    /** 移除 Part */
    remove(part: any): boolean;
    /** 清空 */
    clear(): void;
    /** 是否包含 Part */
    contains(part: any): boolean;
}
