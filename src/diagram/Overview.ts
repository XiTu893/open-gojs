import { Diagram } from './Diagram';
import { Rect } from '../core/Rect';
import { Point } from '../core/Point';

export class Overview {

  private _diagram: Diagram;
  private _observedDiagram: Diagram | null = null;
  private _box: any = null;
  private _isViewportSized: boolean = false;
  private _canvas: HTMLCanvasElement | null = null;
  private _isDragging: boolean = false;
  private _dragStart: Point = new Point(0, 0);
  private _observedPositionAtDragStart: Point = new Point(0, 0);
  private _viewportChangedListener: ((e: any) => void) | null = null;
  private _observedModelChangedListener: ((e: any) => void) | null = null;

  constructor(divId: string | HTMLDivElement) {
    this._diagram = new Diagram(divId);
    this._setupOverview();
  }

  get diagram(): Diagram {
    return this._diagram;
  }

  get observedDiagram(): Diagram | null {
    return this._observedDiagram;
  }

  set observedDiagram(val: Diagram | null) {
    if (this._observedDiagram === val) return;
    this._removeListeners();
    this._observedDiagram = val;
    this._addListeners();
    this.update();
  }

  get box(): any {
    return this._box;
  }

  set box(val: any) {
    this._box = val;
  }

  get isViewportSized(): boolean {
    return this._isViewportSized;
  }

  set isViewportSized(val: boolean) {
    if (this._isViewportSized === val) return;
    this._isViewportSized = val;
    this.update();
  }

  update(): void {
    this.drawOverview();
    this.drawBox();
  }

  drawOverview(): void {
    if (!this._observedDiagram) return;
    const docBounds = this._observedDiagram.documentBounds;
    if (docBounds.isEmpty) return;
    const viewSize = this._diagram.viewSize;
    if (viewSize.isEmpty) return;
    const scale = Math.min(
      viewSize.width / docBounds.width,
      viewSize.height / docBounds.height
    );
    this._diagram.scale = scale;
    this._diagram.position = new Point(docBounds.x, docBounds.y);
    this._diagram.requestUpdate();
  }

  drawBox(): void {
    if (!this._observedDiagram) return;
    const vpBounds = this._observedDiagram.viewportBounds;
    if (vpBounds.isEmpty) return;
    if (this._box) {
      (this._box as any).position = new Point(vpBounds.x, vpBounds.y);
      (this._box as any).width = vpBounds.width;
      (this._box as any).height = vpBounds.height;
    }
    this._drawViewportBox(vpBounds);
  }

  computeBounds(): Rect {
    if (!this._observedDiagram) return new Rect();
    return this._observedDiagram.documentBounds;
  }

  copy(): Overview {
    const overview = new Overview(this._diagram.div || '');
    overview.observedDiagram = this._observedDiagram;
    overview.isViewportSized = this._isViewportSized;
    return overview;
  }

  private _setupOverview(): void {
    this._diagram.isReadOnly = true;
    this._diagram.allowSelect = false;
    this._diagram.allowMove = false;
    this._diagram.allowCopy = false;
    this._diagram.allowDelete = false;
    this._diagram.allowZoom = false;
    this._diagram.allowHorizontalScroll = false;
    this._diagram.allowVerticalScroll = false;

    const div = this._diagram.div;
    if (div) {
      this._canvas = div.querySelector('canvas') as HTMLCanvasElement | null;
      if (this._canvas) {
        this._canvas.addEventListener('mousedown', (e: MouseEvent) => this._onMouseDown(e));
        this._canvas.addEventListener('mousemove', (e: MouseEvent) => this._onMouseMove(e));
        this._canvas.addEventListener('mouseup', (e: MouseEvent) => this._onMouseUp(e));
        this._canvas.addEventListener('mouseleave', (e: MouseEvent) => this._onMouseUp(e));
      }
    }

    this._diagram.addDiagramListener('ViewportChanged', () => {
      this.drawBox();
    });
  }

  private _drawViewportBox(vpBounds: Rect): void {
    if (!this._canvas) return;
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;
    const scale = this._diagram.scale;
    const pos = this._diagram.position;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const x = (vpBounds.x - pos.x) * scale;
    const y = (vpBounds.y - pos.y) * scale;
    const w = vpBounds.width * scale;
    const h = vpBounds.height * scale;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    ctx.restore();
  }

  private _onMouseDown(e: MouseEvent): void {
    if (!this._observedDiagram) return;
    const rect = this._canvas!.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const scale = this._diagram.scale;
    const pos = this._diagram.position;
    const docX = canvasX / scale + pos.x;
    const docY = canvasY / scale + pos.y;

    const vpBounds = this._observedDiagram.viewportBounds;
    const vpCenterX = vpBounds.x + vpBounds.width / 2;
    const vpCenterY = vpBounds.y + vpBounds.height / 2;

    this._isDragging = true;
    this._dragStart = new Point(docX, docY);
    this._observedPositionAtDragStart = this._observedDiagram.position.copy();

    if (docX < vpBounds.x || docX > vpBounds.x + vpBounds.width ||
        docY < vpBounds.y || docY > vpBounds.y + vpBounds.height) {
      const dx = docX - vpCenterX;
      const dy = docY - vpCenterY;
      this._observedDiagram.position = new Point(
        this._observedPositionAtDragStart.x + dx,
        this._observedPositionAtDragStart.y + dy
      );
      this._observedPositionAtDragStart = this._observedDiagram.position.copy();
      this._dragStart = new Point(docX, docY);
    }

    e.preventDefault();
  }

  private _onMouseMove(e: MouseEvent): void {
    if (!this._isDragging || !this._observedDiagram) return;
    const rect = this._canvas!.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const scale = this._diagram.scale;
    const pos = this._diagram.position;
    const docX = canvasX / scale + pos.x;
    const docY = canvasY / scale + pos.y;

    const dx = docX - this._dragStart.x;
    const dy = docY - this._dragStart.y;

    this._observedDiagram.position = new Point(
      this._observedPositionAtDragStart.x + dx,
      this._observedPositionAtDragStart.y + dy
    );
  }

  private _onMouseUp(_e: MouseEvent): void {
    this._isDragging = false;
  }

  private _addListeners(): void {
    if (!this._observedDiagram) return;
    this._viewportChangedListener = () => {
      this.drawBox();
    };
    this._observedDiagram.addDiagramListener('ViewportChanged', this._viewportChangedListener);

    const model = this._observedDiagram.model;
    if (model) {
      this._observedModelChangedListener = () => {
        this.update();
      };
      model.addChangedListener(this._observedModelChangedListener);
    }
  }

  private _removeListeners(): void {
    if (this._observedDiagram) {
      if (this._viewportChangedListener) {
        this._observedDiagram.removeDiagramListener('ViewportChanged', this._viewportChangedListener);
      }
      if (this._observedModelChangedListener) {
        const model = this._observedDiagram.model;
        if (model) {
          model.removeChangedListener(this._observedModelChangedListener);
        }
      }
    }
    this._viewportChangedListener = null;
    this._observedModelChangedListener = null;
  }
}
