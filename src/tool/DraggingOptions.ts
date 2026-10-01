import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { DraggingInfo } from '../core/DraggingInfo';

/**
 * 官方 `DraggingOptions`（go.d.ts: class DraggingOptions）——
 * DraggingTool / RelinkingTool / ResizingTool 共用的一组拖动选项。
 */
export class DraggingOptions {
  static readonly className: string = "DraggingOptions";

  isGridSnapEnabled: boolean = false;
  isGridSnapRealtime: boolean = true;
  gridSnapCellSize: Size = new Size(NaN, NaN);
  gridSnapCellSpot: Spot = Spot.TopLeft.copy();
  gridSnapOrigin: Point = new Point(NaN, NaN);

  dragsLink: boolean = false;
  dragsTree: boolean = false;
  groupsSnapMembers: boolean = false;
  groupsAlwaysMove: boolean = true;
  dragsMembers: boolean = false;

  /** 官方 DraggingOptions.draggingInfo（可多个；工具内部用来记录拖动起点） */
  draggingInfo: DraggingInfo[] = [];

  constructor(init?: Partial<DraggingOptions>) {
    if (init) {
      for (const key of Object.keys(init)) {
        const v = (init as any)[key];
        if (v !== undefined) (this as any)[key] = v;
      }
    }
  }

  copy(): DraggingOptions {
    return new DraggingOptions(this);
  }
}