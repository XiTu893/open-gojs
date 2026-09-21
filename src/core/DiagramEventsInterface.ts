export interface DiagramEventsInterface {

  /** Fired when the user presses a mouse button down on the diagram. */
  mouseDown?: (e: mouseEvent) => void;

  /** Fired when the user presses a mouse button up on the diagram. */
  mouseUp?: (e: mouseEvent) => void;

  /** Fired when the user clicks on the diagram. */
  click?: (e: mouseEvent) => void;

  /** Fired when the user double-clicks on the diagram. */
  doubleClick?: (e: mouseEvent) => void;

  /** Fired when the user moves the mouse over the diagram. */
  mouseMove?: (e: mouseEvent) => void;

  /** Fired when the user moves the mouse off the diagram. */
  mouseOut?: (e: mouseEvent) => void;

  /** Fired when the user moves the mouse on the diagram. */
  mouseOver?: (e: mouseEvent) => void;

  /** Fired when the user scrolls the mouse wheel. */
  mouseWheel?: (e: mouseEvent) => void;

  /** Fired when a key is pressed down. */
  keyDown?: (e: keyEvent) => void;

  /** Fired when a key is released. */
  keyUp?: (e: keyEvent) => void;

  /** Fired when the diagram is dragged. */
  drag?: (e: dragEvent) => void;

  /** Fired when the diagram is panned. */
  pan?: (e: pointEvent) => void;

  /** Fired when the diagram is zoomed. */
  zoom?: (e: number) => void;

  /** Fired when the selection changes. */
  selectionChanged?: () => void;

  /** Fired when the diagram is reset. */
  reset?: () => void;

  /** Fired when the layout completes. */
  layoutCompleted?: () => void;
}

interface mouseEvent {
  /** x position of the mouse event. */
  x: number;
  /** y position of the mouse event. */
  y: number;
  /** right click. */
  rightClick: boolean;
  /** shift key. */
  shiftKey: boolean;
  /** control key. */
  ctrlKey: boolean;
  /** alt key. */
  altKey: boolean;
}

interface keyEvent {
  /** key code. */
  key: string;
  /** shift key. */
  shiftKey: boolean;
  /** control key. */
  ctrlKey: boolean;
  /** alt key. */
  altKey: boolean;
}

interface dragEvent {
  /** x position. */
  x: number;
  /** y position. */
  y: number;
  /** original event. */
  originalEvent: mouseEvent;
}

interface pointEvent {
  /** x position. */
  x: number;
  /** y position. */
  y: number;
}