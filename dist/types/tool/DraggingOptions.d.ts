import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { DraggingInfo } from '../core/DraggingInfo';
/**
 * 官方 `DraggingOptions`（go.d.ts: class DraggingOptions）——
 * DraggingTool / RelinkingTool / ResizingTool 共用的一组拖动选项。
 */
export declare class DraggingOptions {
    static readonly className: string;
    isGridSnapEnabled: boolean;
    isGridSnapRealtime: boolean;
    gridSnapCellSize: Size;
    gridSnapCellSpot: Spot;
    gridSnapOrigin: Point;
    dragsLink: boolean;
    dragsTree: boolean;
    groupsSnapMembers: boolean;
    groupsAlwaysMove: boolean;
    dragsMembers: boolean;
    /** 官方 DraggingOptions.draggingInfo（可多个；工具内部用来记录拖动起点） */
    draggingInfo: DraggingInfo[];
    constructor(init?: Partial<DraggingOptions>);
    copy(): DraggingOptions;
}
