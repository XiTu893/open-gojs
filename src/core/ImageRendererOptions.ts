export class ImageRendererOptions {

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

  constructor(options?: Partial<ImageRendererOptions>) {
    this.width = options?.width || 800;
    this.height = options?.height || 600;
    this.background = options?.background || '#FFFFFF';
    this.format = options?.format || 'png';
    this.quality = options?.quality ?? 1.0;
    this.transparent = options?.transparent ?? false;
  }
}