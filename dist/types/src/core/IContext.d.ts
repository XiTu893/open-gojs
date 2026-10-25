export interface IContext {
    /** The diagram associated with this context. */
    diagram: any;
    /** The current tool. */
    currentTool: any;
    /** The layer. */
    layer: any;
    /** The angle of the view. */
    angle: number;
    /** The scale of the view. */
    scale: number;
    /** The position of the view. */
    position: any;
    /** The viewport bounds. */
    viewportBounds: any;
    /** The model. */
    model: any;
    /** The renderer. */
    renderer: any;
    /** The command handler. */
    commandHandler: any;
    /** The tool manager. */
    toolManager: any;
    /** The animation manager. */
    animationManager: any;
    /** The theme manager. */
    themeManager: any;
    /** The context menu. */
    contextMenu: any;
    /** The model changed listener. */
    modelChangedListener: any;
    /** The diagram listener. */
    diagramListener: any;
    /** The listener for rendered diagrams. */
    renderedListener: any;
}
