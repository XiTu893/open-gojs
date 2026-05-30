import { Iterator } from '../core/Iterable';
/**
 * Layer - 图层
 * 控制绘制顺序和可见性
 */
export declare class Layer {
    /** 图层名称 */
    name: string;
    /** 不透明度 */
    opacity: number;
    /** 是否可见 */
    visible: boolean;
    /** 是否为临时图层 */
    isTemporary: boolean;
    /** Z 序 */
    zIndex: number;
    /** 所属 Diagram */
    private _diagram;
    /** 图层中的 Part 集合 */
    private _parts;
    constructor();
    get diagram(): any;
    set diagram(val: any);
    get parts(): Iterator<any>;
    get partsCount(): number;
    /** 添加 Part */
    add(part: any): void;
    /** 移除 Part */
    remove(part: any): boolean;
    /** 清空 */
    clear(): void;
    /** 是否包含 Part */
    contains(part: any): boolean;
}
