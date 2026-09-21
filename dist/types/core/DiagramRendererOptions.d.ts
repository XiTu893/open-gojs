export declare class DiagramRendererOptions {
    /** The type of renderer to use */
    type: string;
    /** The width of the rendered image in pixels */
    width: number;
    /** The height of the rendered image in pixels */
    height: number;
    /** The background color for the rendered image */
    background: string;
    /** Whether to include interactive layer information */
    showBounds: boolean;
    /** Whether to include visual studio-style adorner feedback */
    showShadow: boolean;
    /** Whether to antialias the rendered output */
    antialias: boolean;
    constructor(options?: Partial<DiagramRendererOptions>);
}
