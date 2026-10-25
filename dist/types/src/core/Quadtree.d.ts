import { Rect } from './Rect';
import { Map } from './Map';
import { Set } from './Set';
/**
 * 官方 `Quadtree<T>`（go.d.ts: class Quadtree）——
 * 四叉树空间索引，官方用于 `Diagram.findObjectsIn/near` 与 AvoidsNodesRouter。
 */
export declare class Quadtree<T = any> {
    static readonly className: string;
    private _bounds;
    private _level;
    private _maxObjects;
    private _maxLevels;
    private _isLeaf;
    private _objects;
    private _northWest;
    private _northEast;
    private _southWest;
    private _southEast;
    constructor(x: number, y: number, w: number, h: number, maxObjects?: number, maxLevels?: number, level?: number);
    get bounds(): Rect;
    get level(): number;
    get isLeaf(): boolean;
    /** 官方 Quadtree.clear() */
    clear(): void;
    /** 官方 Quadtree.reinitialize(maxObjects?) */
    reinitialize(maxObjects?: number): void;
    /** 官方 Quadtree.resize(rect, inflate?) */
    resize(rect: Rect, inflate?: number): void;
    /** 官方 Quadtree.set(obj, bounds) —— 返回 false 表示 obj 与已有对象重叠 */
    set(obj: T, bounds: Rect): boolean;
    /** 官方 Quadtree.add(obj, bounds) */
    add(obj: T, bounds: Rect): boolean;
    /** 官方 Quadtree.setTo(obj, x, y, w?, h?) */
    setTo(obj: T, x: number, y: number, w?: number, h?: number): boolean;
    /** 官方 Quadtree.find(r, result?) —— 找出与 r 相交（或包含 r）的对象 */
    find(r: Rect, result?: Set<T>): Set<T>;
    /** 官方 Quadtree.findIn(x, y, w?, h?) */
    findIn(x: number, y: number, w?: number, h?: number, result?: Set<T>): Set<T>;
    /** 官方 Quadtree.delete(obj, fast?) */
    delete(obj: T, fast?: boolean): boolean;
    /** 官方 Quadtree.remove(obj, fast?) */
    remove(obj: T, fast?: boolean): boolean;
    /** 官方 Quadtree.move(obj, rect, fast?) */
    move(obj: T, rect: Rect, fast?: boolean): void;
    /** 官方 Quadtree.moveTo(obj, x, y, w, h, fast?) */
    moveTo(obj: T, x: number, y: number, w: number, h: number, fast?: boolean): void;
    /** 官方 Quadtree.toMap(allObjects?) */
    toMap(allObjects?: Map<T, Rect>): Map<T, Rect>;
    private _split;
    private _intersects;
    private _addToChild;
    private _find;
}
