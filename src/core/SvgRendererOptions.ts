export class SvgRendererOptions {

  /** The width of the rendered SVG in pixels */
  width: number;

  /** The height of the rendered SVG in pixels */
  height: number;

  /** The background color for the rendered SVG */
  background: string;

  /** Whether to include interactive layer information */
  showBounds: boolean;

  /** Whether to antialias the rendered output */
  antialias: boolean;

  /** The format for font rendering */
  fontFormat: string;

  constructor(options?: Partial<SvgRendererOptions>) {
    this.width = options?.width || 800;
    this.height = options?.height || 600;
    this.background = options?.background || '#FFFFFF';
    this.showBounds = options?.showBounds ?? false;
    this.antialias = options?.antialias ?? true;
    this.fontFormat = options?.fontFormat || 'normal';
  }
}