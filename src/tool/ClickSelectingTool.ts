import { Tool } from './Tool';
import { Point } from '../core/Point';
import type { GraphObject } from '../view/GraphObject';
import type { Part } from '../view/Part';

export class ClickSelectingTool extends Tool {
  static readonly className: string = "ClickSelectingTool";

  private _lastClickTime: number = 0;
  private _lastClickObj: GraphObject | null = null;

  constructor() {
    super();
    this.name = 'ClickSelecting';
  }

  /**
   * 官方 ClickSelectingTool.canStart（go.js 逐字）：
   *   return !(!this.isEnabled || this.isBeyondDragSize())
   * 以前缺 isBeyondDragSize 判定；而 ClickSelectingTool 排在 mouseUpTools 末位，
   * 拖拽后本不该再触发点选。
   */
  canStart(): boolean {
    if (!this.isEnabled) return false;
    return !this.isBeyondDragSize();
  }

  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const now = Date.now();
    const docPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const obj = diagram.findObjectAt(docPoint);
    const part = diagram.findPartAt(docPoint, true);

    const isDoubleClick = obj && obj === this._lastClickObj && (now - this._lastClickTime) < 500;

    if (lastInput.rightButton) {
      this._handleContextClick(diagram, obj, part, lastInput);
    } else if (isDoubleClick) {
      this._handleDoubleClick(diagram, obj, part, lastInput);
    } else {
      this._handleSingleClick(diagram, obj, part, lastInput);
    }

    this._lastClickTime = now;
    this._lastClickObj = obj;

    this.stopTool();
  }

  private _handleSingleClick(diagram: any, obj: GraphObject | null, part: Part | null, lastInput: any): void {
    this.standardMouseSelect();

    if (obj && obj.click) {
      obj.click(lastInput, obj);
    }

    if (part) {
      diagram.raiseDiagramEvent('ObjectSingleClicked', part);
    } else {
      diagram.raiseDiagramEvent('BackgroundSingleClicked', diagram);
    }
  }

  private _handleDoubleClick(diagram: any, obj: GraphObject | null, part: Part | null, lastInput: any): void {
    if (obj && obj.doubleClick) {
      obj.doubleClick(lastInput, obj);
    }

    if (part) {
      diagram.raiseDiagramEvent('ObjectDoubleClicked', part);
    } else {
      diagram.raiseDiagramEvent('BackgroundDoubleClicked', diagram);
    }

    this._lastClickTime = 0;
    this._lastClickObj = null;
  }

  private _handleContextClick(diagram: any, obj: GraphObject | null, part: Part | null, lastInput: any): void {
    if (obj && obj.contextClick) {
      obj.contextClick(lastInput, obj);
    }

    if (part) {
      diagram.raiseDiagramEvent('ObjectContextClicked', part);
    } else {
      diagram.raiseDiagramEvent('BackgroundContextClicked', diagram);
    }
  }

  standardMouseSelect(): void {
    const diagram = this.diagram;
    if (!diagram) return;
    if (!(diagram as any).allowSelect) return;
    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const docPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const part = diagram.findPartAt(docPoint, true);
    let changed = false;

    if (part) {
      if (lastInput.control || lastInput.meta) {
        diagram.raiseDiagramEvent('ChangingSelection', diagram.selection);
        if (part.isSelected) {
          diagram.selection.remove(part);
          part.isSelected = false;
        } else {
          part.isSelected = true;
          diagram.selection.add(part);
        }
        changed = true;
      } else if (lastInput.shift) {
        if (!part.isSelected) {
          diagram.raiseDiagramEvent('ChangingSelection', diagram.selection);
          part.isSelected = true;
          diagram.selection.add(part);
          changed = true;
        }
      } else if (!part.isSelected) {
        diagram.select(part);
        changed = true;
      }
    } else if (this.canStartButton() && !lastInput.control && !lastInput.meta && !lastInput.shift) {
      // 官方：指下没有部件且主键无修饰键时才清空选择（右键不许清）
      diagram.clearSelection();
      changed = true;
    }
    if (changed) diagram.raiseDiagramEvent('ChangedSelection', diagram.selection);
    diagram.requestUpdate();
  }
}
