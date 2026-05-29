import { Tool } from './Tool';
import { Diagram } from '../diagram/Diagram';
import { InputEvent } from '../diagram/InputEvent';
import { Point } from '../core/Point';
import { ClickSelectingTool } from './ClickSelectingTool';
import { DraggingTool } from './DraggingTool';
import { DragSelectingTool } from './DragSelectingTool';
import { LinkingTool } from './LinkingTool';
import { RelinkingTool } from './RelinkingTool';
import { LinkReshapingTool } from './LinkReshapingTool';
import { ResizingTool } from './ResizingTool';
import { RotatingTool } from './RotatingTool';
import { TextEditingTool } from './TextEditingTool';
import { PanningTool } from './PanningTool';
import { ContextMenuTool } from './ContextMenuTool';
import { ClickCreatingTool } from './ClickCreatingTool';
import { ActionTool } from './ActionTool';

/**
 * ToolManager - manages tool dispatch and event routing.
 * Holds lists of mouse-down, mouse-move, and mouse-up tools,
 * and dispatches events to the appropriate tool.
 */
export class ToolManager extends Tool {

  private _mouseDownTools: Tool[] = [];
  private _mouseMoveTools: Tool[] = [];
  private _mouseUpTools: Tool[] = [];
  private _mouseHoverTools: Tool[] = [];
  private _currentTool: Tool | null = null;
  private _defaultTool: Tool;
  private _hoverDelay: number = 0;
  private _holdDelay: number = 0;
  private _lastInput: InputEvent = new InputEvent();
  private _previousInput: InputEvent = new InputEvent();
  private _mouseDownPoint: Point | null = null;

  constructor() {
    super();
    this.name = 'ToolManager';

    // Create default tool instances
    const clickSelectingTool = new ClickSelectingTool();
    const draggingTool = new DraggingTool();
    const dragSelectingTool = new DragSelectingTool();
    const linkingTool = new LinkingTool();
    const relinkingTool = new RelinkingTool();
    const linkReshapingTool = new LinkReshapingTool();
    const resizingTool = new ResizingTool();
    const rotatingTool = new RotatingTool();
    const textEditingTool = new TextEditingTool();
    const panningTool = new PanningTool();
    const contextMenuTool = new ContextMenuTool();
    const clickCreatingTool = new ClickCreatingTool();
    const actionTool = new ActionTool();

    // Default tool is ClickSelectingTool
    this._defaultTool = clickSelectingTool;
    this._currentTool = this._defaultTool;

    // Mouse-down tools (checked in order on mouse-down)
    this._mouseDownTools = [
      actionTool,
      relinkingTool,
      linkReshapingTool,
      resizingTool,
      rotatingTool,
      linkingTool,
      draggingTool,
      dragSelectingTool,
      panningTool,
      contextMenuTool,
    ];

    // Mouse-move tools (checked in order on mouse-move)
    this._mouseMoveTools = [
      draggingTool,
      dragSelectingTool,
      linkingTool,
      relinkingTool,
      linkReshapingTool,
      resizingTool,
      rotatingTool,
      panningTool,
    ];

    // Mouse-up tools (checked in order on mouse-up)
    this._mouseUpTools = [
      clickSelectingTool,
      clickCreatingTool,
      contextMenuTool,
    ];

    // Mouse-hover tools
    this._mouseHoverTools = [];
  }

  // ============ Properties ============

  get mouseDownTools(): Tool[] { return this._mouseDownTools; }
  set mouseDownTools(val: Tool[]) { this._mouseDownTools = val; }

  get mouseMoveTools(): Tool[] { return this._mouseMoveTools; }
  set mouseMoveTools(val: Tool[]) { this._mouseMoveTools = val; }

  get mouseUpTools(): Tool[] { return this._mouseUpTools; }
  set mouseUpTools(val: Tool[]) { this._mouseUpTools = val; }

  get mouseHoverTools(): Tool[] { return this._mouseHoverTools; }
  set mouseHoverTools(val: Tool[]) { this._mouseHoverTools = val; }

  get currentTool(): Tool | null { return this._currentTool; }
  set currentTool(val: Tool | null) {
    if (this._currentTool && this._currentTool.isActive) {
      this._currentTool.doDeactivate();
    }
    this._currentTool = val;
    if (val) {
      val.diagram = this.diagram;
      val.doStart();
    }
  }

  get defaultTool(): Tool { return this._defaultTool; }
  set defaultTool(val: Tool) {
    this._defaultTool = val;
    if (val) {
      val.diagram = this.diagram;
    }
  }

  get clickSelectingTool(): ClickSelectingTool {
    return this._mouseDownTools.find(t => t instanceof ClickSelectingTool) as ClickSelectingTool;
  }
  get draggingTool(): DraggingTool {
    return this._mouseDownTools.find(t => t instanceof DraggingTool) as DraggingTool;
  }
  get dragSelectingTool(): DragSelectingTool {
    return this._mouseMoveTools.find(t => t instanceof DragSelectingTool) as DragSelectingTool;
  }
  get linkingTool(): LinkingTool {
    return this._mouseDownTools.find(t => t instanceof LinkingTool) as LinkingTool;
  }
  get relinkingTool(): RelinkingTool {
    return this._mouseDownTools.find(t => t instanceof RelinkingTool) as RelinkingTool;
  }
  get linkReshapingTool(): LinkReshapingTool {
    return this._mouseDownTools.find(t => t instanceof LinkReshapingTool) as LinkReshapingTool;
  }
  get resizingTool(): ResizingTool {
    return this._mouseDownTools.find(t => t instanceof ResizingTool) as ResizingTool;
  }
  get rotatingTool(): RotatingTool {
    return this._mouseDownTools.find(t => t instanceof RotatingTool) as RotatingTool;
  }
  get textEditingTool(): TextEditingTool {
    return this._mouseDownTools.find(t => t instanceof TextEditingTool) as TextEditingTool;
  }
  get panningTool(): PanningTool {
    return this._mouseMoveTools.find(t => t instanceof PanningTool) as PanningTool;
  }
  get contextMenuTool(): ContextMenuTool {
    return this._mouseUpTools.find(t => t instanceof ContextMenuTool) as ContextMenuTool;
  }
  get clickCreatingTool(): ClickCreatingTool {
    return this._mouseUpTools.find(t => t instanceof ClickCreatingTool) as ClickCreatingTool;
  }
  get actionTool(): ActionTool {
    return this._mouseDownTools.find(t => t instanceof ActionTool) as ActionTool;
  }

  get hoverDelay(): number { return this._hoverDelay; }
  set hoverDelay(val: number) { this._hoverDelay = val; }

  get holdDelay(): number { return this._holdDelay; }
  set holdDelay(val: number) { this._holdDelay = val; }

  get lastInput(): InputEvent { return this._lastInput; }
  set lastInput(val: InputEvent) { this._lastInput = val; }

  get previousInput(): InputEvent { return this._previousInput; }

  // ============ Override Diagram setter ============

  set diagram(val: Diagram | null) {
    this._diagram = val;
    // Propagate diagram to all managed tools
    for (const tool of this._mouseDownTools) { tool.diagram = val; }
    for (const tool of this._mouseMoveTools) { tool.diagram = val; }
    for (const tool of this._mouseUpTools) { tool.diagram = val; }
    for (const tool of this._mouseHoverTools) { tool.diagram = val; }
    if (this._defaultTool) { this._defaultTool.diagram = val; }
    if (this._currentTool) { this._currentTool.diagram = val; }
  }

  // ============ Event Dispatch Methods ============

  /** Dispatch mouse-down event to the appropriate tool. */
  doMouseDown(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;

    // Save the previous input
    this._previousInput = this._lastInput.copy();

    // Store the mouse-down point
    this._mouseDownPoint = new Point(this._lastInput.documentPoint.x, this._lastInput.documentPoint.y);

    // If there is a current active tool, let it handle the event
    if (this._currentTool && this._currentTool.isActive) {
      this._currentTool.doMouseDown();
      return;
    }

    // Try each mouse-down tool in order
    for (const tool of this._mouseDownTools) {
      if (!tool.isEnabled) continue;
      if (tool.canStart()) {
        this.currentTool = tool;
        tool.doActivate();
        tool.doMouseDown();
        return;
      }
    }

    // No tool could start - use default tool
    this.currentTool = this._defaultTool;
    if (this._currentTool) {
      this._currentTool.doMouseDown();
    }
  }

  /** Dispatch mouse-move event to the current tool. */
  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;

    this._previousInput = this._lastInput.copy();

    if (this._currentTool) {
      this._currentTool.doMouseMove();
    }
  }

  /** Dispatch mouse-up event to the current tool. */
  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;

    this._previousInput = this._lastInput.copy();

    // If there is a current active tool, let it handle the event
    if (this._currentTool && this._currentTool.isActive) {
      this._currentTool.doMouseUp();
      return;
    }

    // Try each mouse-up tool in order
    for (const tool of this._mouseUpTools) {
      if (!tool.isEnabled) continue;
      if (tool.canStart()) {
        this.currentTool = tool;
        tool.doActivate();
        tool.doMouseUp();
        return;
      }
    }

    // No tool could start - use default tool
    this.currentTool = this._defaultTool;
    if (this._currentTool) {
      this._currentTool.doMouseUp();
    }
  }

  /** Dispatch key-down event to the current tool. */
  doKeyDown(): void {
    if (this._currentTool) {
      this._currentTool.doKeyDown();
    }
  }

  /** Dispatch key-up event to the current tool. */
  doKeyUp(): void {
    if (this._currentTool) {
      this._currentTool.doKeyUp();
    }
  }

  /** Dispatch mouse-wheel event to the current tool. */
  doMouseWheel(): void {
    if (this._currentTool) {
      this._currentTool.doMouseWheel();
    } else {
      this.standardMouseWheel();
    }
  }

  /** Update adornments for all relevant parts. */
  updateAdornments(part: any): void {
    // Propagate to all tools that manage adornments
    for (const tool of this._mouseDownTools) {
      tool.updateAdornments(part);
    }
  }

  /** Standard mouse wheel: zoom in/out centered on mouse position. */
  standardMouseWheel(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).allowZoom) return;

    const e = this._lastInput;
    if (!e || !e.nativeEvent) return;

    const wheelEvent = e.nativeEvent as WheelEvent;
    const delta = wheelEvent.deltaMode === 1 ? wheelEvent.deltaY * 40 : wheelEvent.deltaY;

    if (wheelEvent.ctrlKey || Math.abs(delta) < 40) {
      const oldScale = diagram.scale;
      const factor = delta > 0 ? 0.9 : 1.1;
      let newScale = oldScale * factor;
      newScale = Math.max(diagram.minScale, Math.min(diagram.maxScale, newScale));

      const viewPoint = new Point(e.viewPoint.x, e.viewPoint.y);
      const padding = diagram.padding;
      const mouseDocX = (viewPoint.x - padding.left) / oldScale + diagram.position.x;
      const mouseDocY = (viewPoint.y - padding.top) / oldScale + diagram.position.y;

      diagram.scale = newScale;
      diagram.position = new Point(
        mouseDocX - (viewPoint.x - padding.left) / newScale,
        mouseDocY - (viewPoint.y - padding.top) / newScale
      );
    } else {
      const scrollX = wheelEvent.shiftKey ? delta : 0;
      const scrollY = wheelEvent.shiftKey ? 0 : delta;
      if ((diagram as any).allowHorizontalScroll || (diagram as any).allowVerticalScroll) {
        const pos = diagram.position;
        diagram.position = new Point(
          pos.x + scrollX / diagram.scale,
          pos.y + scrollY / diagram.scale
        );
      }
    }
  }
}
