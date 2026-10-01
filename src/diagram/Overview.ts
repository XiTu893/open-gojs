import { Diagram } from './Diagram';
import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import { Part } from '../view/Part';
import { Shape } from '../view/Shape';

export class Overview {
  static readonly className: string = "Overview";
  static _dbg = true;

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
  private _observedDiagramChangedListener: ((e: any) => void) | null = null;
  private _observedLayoutListener: ((e: any) => void) | null = null;
  private _boundModel: any = null;

  /**
   * 官方 `Overview(div?, init?)`：第一参可为 div 或 init 对象；
   * 默认 box 为带 BOXSHAPE 的 Part（官方 Overview ctor 同款）。
   */
  constructor(divOrOptions?: string | HTMLDivElement | Record<string, any>, options?: Record<string, any>) {
    let divId: string | HTMLDivElement = '';
    let opts = options;
    if (typeof divOrOptions === 'string') {
      divId = divOrOptions;
    } else if (typeof HTMLDivElement !== 'undefined' && divOrOptions instanceof HTMLDivElement) {
      divId = divOrOptions;
    } else if (divOrOptions !== null && divOrOptions !== undefined && typeof divOrOptions === 'object') {
      opts = divOrOptions as Record<string, any>;
    }
    this._diagram = new Diagram(divId);
    this._setupOverview();
    const box: any = new Part({
      selectable: true,
      selectionAdorned: false,
      selectionObjectName: 'BOXSHAPE',
      locationObjectName: 'BOXSHAPE',
      resizeObjectName: 'BOXSHAPE',
      cursor: 'move',
    } as any);
    box.add(new Shape({
      name: 'BOXSHAPE',
      fill: 'transparent',
      stroke: 'magenta',
      strokeWidth: 2,
    } as any));
    this._box = box;
    if (opts) {
      for (const key of Object.keys(opts)) {
        (this as any)[key] = (opts as any)[key];
      }
    }
  }

  /** 官方 Overview 为 Diagram 子类，div 可读（如 `overview.div.style`） */
  get div(): string | HTMLDivElement | null {
    return (this._diagram as any).div ? (this._diagram as any).div : null;
  }

  /** 官方 Overview 为 Diagram 子类，add/remove 作用于其内部图纸 */
  add(part: any): any {
    this._diagram.add(part);
    return this;
  }

  remove(part: any): void {
    this._diagram.remove(part);
  }

  get diagram(): Diagram {
    return this._diagram;
  }

  get observedDiagram(): Diagram | null {
    return this._observedDiagram;
  }

  /** 官方属性名就是 `Overview.observed` */
  get observed(): Diagram | null {
    return this._observedDiagram;
  }

  set observed(val: Diagram | null) {
    this.observedDiagram = val;
  }

  set observedDiagram(val: Diagram | null) {
    if (this._observedDiagram === val) return;
    this._removeListeners();
    this._observedDiagram = val;
    this._syncInnerFromObserved();
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
    this._syncInnerFromObserved();
    this.drawOverview();
    this.drawBox();
  }

  /**
   * 官方 Overview（Diagram 子类）直接渲染 observed 的部件；
   * 本项目让内部图纸共享 observed 的 model + 模板自建同位置部件。
   * 模板可能在 observed 设置之后才赋值，故每次 update 都同步。
   */
  private _syncInnerFromObserved(): void {
    const obs = this._observedDiagram;
    if (!obs) return;
    const d: any = this._diagram;
    const tmplChanged =
      d.nodeTemplate !== (obs as any).nodeTemplate ||
      d.nodeTemplateMap !== (obs as any).nodeTemplateMap ||
      d.linkTemplate !== (obs as any).linkTemplate ||
      d.linkTemplateMap !== (obs as any).linkTemplateMap ||
      d.groupTemplate !== (obs as any).groupTemplate ||
      d.groupTemplateMap !== (obs as any).groupTemplateMap;
    d.nodeTemplate = (obs as any).nodeTemplate;
    d.nodeTemplateMap = (obs as any).nodeTemplateMap;
    d.linkTemplate = (obs as any).linkTemplate;
    d.linkTemplateMap = (obs as any).linkTemplateMap;
    d.groupTemplate = (obs as any).groupTemplate;
    d.groupTemplateMap = (obs as any).groupTemplateMap;
    if (d.model !== obs.model) {
      d.model = obs.model;
    } else if (tmplChanged) {
      d.rebuildParts();
    }
    this._copyObservedPositions();
    if (typeof console !== 'undefined' && (Overview as any)._dbg) {
      let n = 0;
      d.nodes.each(() => { n++; });
      console.log('DBG syncInner tmplChanged=' + tmplChanged + ' innerNodes=' + n +
        ' nodeTemplate=' + (d.nodeTemplate ? d.nodeTemplate.className || 'obj' : 'null') +
        ' scale=' + d.scale + ' pos=' + d.position);
    }
  }

  /** 抄回 observed 部件位置（内部部件由共享 model 重建，需与 observed 对齐） */
  private _copyObservedPositions(): void {
    const obs = this._observedDiagram;
    if (!obs) return;
    const d: any = this._diagram;
    obs.nodes.each((node: any) => {
      if (!node || node.data === null || node.data === undefined) return;
      const inner = d.findPartForData ? d.findPartForData(node.data) : null;
      if (inner && inner !== node) {
        const loc = node.location;
        inner.location = loc.copy();
      }
    });
  }

  drawOverview(): void {
    if (!this._observedDiagram) return;
    const docBounds = this._observedDiagram.documentBounds;
    if (docBounds.isEmpty()) return;
    const viewSize = this._diagram.viewSize;
    if (viewSize.isEmpty()) return;
    const scale = Math.min(
      viewSize.width / docBounds.width,
      viewSize.height / docBounds.height
    );
    if (!isFinite(scale) || scale <= 0) return;
    // 官方 Overview ctor 设 autoScale=Uniform → zoomToFit：按较小比例铺满 + 文档居中
    const pos = new Point(
      docBounds.x + docBounds.width / 2 - viewSize.width / scale / 2,
      docBounds.y + docBounds.height / 2 - viewSize.height / scale / 2,
    );
    this._diagram.scale = scale;
    this._diagram.position = pos;
    this._diagram.requestUpdate();
    if (typeof console !== 'undefined' && (Overview as any)._dbg) {
      let n = 0;
      this._diagram.nodes.each(() => { n++; });
      let obsN = 0;
      let nanLoc = 0;
      let firstNan = '';
      let nanBounds = 0;
      let firstNanB = '';
      this._observedDiagram.nodes.each((nd: any) => {
        obsN++;
        if (isNaN(nd.location.x) || isNaN(nd.location.y)) {
          nanLoc++;
          if (!firstNan) firstNan = (nd.data ? nd.data.kind : '?') + ' loc=' + nd.location;
        }
        const b = nd.getDocumentBounds ? nd.getDocumentBounds() : null;
        if (b && (isNaN(b.x) || isNaN(b.y) || isNaN(b.width) || isNaN(b.height))) {
          nanBounds++;
          if (!firstNanB) firstNanB = (nd.data ? nd.data.kind : '?') + ' b=' + b.x + ',' + b.y + ',' + b.width + 'x' + b.height + ' actual=' + nd.actualBounds;
        }
      });
      console.log('DBG drawOverview scale=' + scale + ' pos=' + this._diagram.position +
        ' innerNodes=' + n + ' view=' + viewSize.width + 'x' + viewSize.height +
        ' doc=' + docBounds.width + 'x' + docBounds.height +
        ' obsNodes=' + obsN + ' nanLoc=' + nanLoc + '(' + firstNan + ')' +
        ' nanBounds=' + nanBounds + '(' + firstNanB + ')');
    }
  }

  drawBox(): void {
    if (!this._observedDiagram) return;
    const vpBounds = this._observedDiagram.viewportBounds;
    if (vpBounds.isEmpty()) return;
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

    // 内部图纸完成布局（含首次，会跑 initialViewport 覆盖 scale/position）后重抄位置并重画
    const resync = (): void => {
      this._copyObservedPositions();
      this.drawOverview();
    };
    this._diagram.addDiagramListener('LayoutCompleted', resync);
    this._diagram.addDiagramListener('InitialLayoutCompleted', resync);
  }

  private _drawViewportBox(vpBounds: Rect): void {
    if (!this._canvas) return;
    const ctx = this._canvas.getContext('2d');
    if (!ctx) return;
    const scale = this._diagram.scale;
    const pos = this._diagram.position;
    const dpr = window.devicePixelRatio || 1;

    // 样式取自 box 的 BOXSHAPE（官方 box 即 Part，样式可被用户改）
    let fill: any = 'rgba(0, 0, 0, 0.05)';
    let stroke: any = 'rgba(0, 0, 0, 0.4)';
    let lineWidth = 1;
    if (this._box && typeof this._box.findObject === 'function') {
      const boxShape = this._box.findObject('BOXSHAPE');
      if (boxShape) {
        if (boxShape.fill !== null && boxShape.fill !== undefined) fill = boxShape.fill;
        if (boxShape.stroke !== null && boxShape.stroke !== undefined) stroke = boxShape.stroke;
        if (boxShape.strokeWidth !== null && boxShape.strokeWidth !== undefined && boxShape.strokeWidth > 0) {
          lineWidth = boxShape.strokeWidth;
        }
      }
    }
    if (fill !== null && typeof fill === 'object') fill = fill.color ?? 'transparent';
    if (stroke !== null && typeof stroke === 'object') stroke = stroke.color ?? 'transparent';

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const x = (vpBounds.x - pos.x) * scale;
    const y = (vpBounds.y - pos.y) * scale;
    const w = vpBounds.width * scale;
    const h = vpBounds.height * scale;

    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
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

    // observed 整体换 model（如 regenerate）→ 重挂监听 + 同步内部图纸
    this._observedDiagramChangedListener = () => {
      if (this._observedModelChangedListener && this._boundModel) {
        this._boundModel.removeChangedListener(this._observedModelChangedListener);
      }
      this._boundModel = this._observedDiagram ? this._observedDiagram.model : null;
      if (this._boundModel && this._observedModelChangedListener) {
        this._boundModel.addChangedListener(this._observedModelChangedListener);
      }
      this.update();
    };
    this._observedDiagram.addDiagramListener('ModelChanged', this._observedDiagramChangedListener);

    this._observedModelChangedListener = () => {
      this.update();
    };
    this._boundModel = this._observedDiagram.model;
    if (this._boundModel) {
      this._boundModel.addChangedListener(this._observedModelChangedListener);
    }

    // observed 首次布局完成/文档边界更新后，documentBounds 才是实数，需重算 overview
    this._observedLayoutListener = () => {
      this.update();
    };
    this._observedDiagram.addDiagramListener('DocumentBoundsChanged', this._observedLayoutListener);
    this._observedDiagram.addDiagramListener('LayoutCompleted', this._observedLayoutListener);
    this._observedDiagram.addDiagramListener('InitialLayoutCompleted', this._observedLayoutListener);
  }

  private _removeListeners(): void {
    if (this._observedDiagram) {
      if (this._viewportChangedListener) {
        this._observedDiagram.removeDiagramListener('ViewportChanged', this._viewportChangedListener);
      }
      if (this._observedDiagramChangedListener) {
        this._observedDiagram.removeDiagramListener('ModelChanged', this._observedDiagramChangedListener);
      }
      if (this._observedLayoutListener) {
        this._observedDiagram.removeDiagramListener('DocumentBoundsChanged', this._observedLayoutListener);
        this._observedDiagram.removeDiagramListener('LayoutCompleted', this._observedLayoutListener);
        this._observedDiagram.removeDiagramListener('InitialLayoutCompleted', this._observedLayoutListener);
      }
    }
    if (this._observedModelChangedListener && this._boundModel) {
      this._boundModel.removeChangedListener(this._observedModelChangedListener);
    }
    this._viewportChangedListener = null;
    this._observedDiagramChangedListener = null;
    this._observedModelChangedListener = null;
    this._observedLayoutListener = null;
    this._boundModel = null;
  }
}
