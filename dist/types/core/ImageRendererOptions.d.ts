export declare class ImageRendererOptions {
    /** The width of the rendered image in pixels */
    width: number;
    /** The height of the rendered image in pixels */
    height: number;
    /** The background color for the rendered image */
    background: string;
    /** The image format (e.g., 'png', 'jpeg') */
    format: string;
    /** The quality of the rendered image (0-1) */
    quality: number;
    /** Whether to include transparent background */
    transparent: boolean;
    constructor(options?: Partial<ImageRendererOptions>);
}
