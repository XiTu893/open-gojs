import { Tool } from './Tool';
import { Point } from '../core/Point';
import { TextBlock } from '../view/TextBlock';
import { Brush } from '../core/Brush';

export class TextEditingTool extends Tool {

  private _textBlock: TextBlock | null = null;
  private _defaultText: string = '';
  private _currentText: string = '';
  private _textBox: HTMLTextAreaElement | HTMLInputElement | null = null;

  constructor() {
    super();
    this.name = 'TextEditing';
  }

  get textBlock(): TextBlock | null { return this._textBlock; }
  set textBlock(val: TextBlock | null) { this._textBlock = val; }

  get defaultText(): string { return this._defaultText; }
  set defaultText(val: string) { this._defaultText = val; }

  get currentText(): string { return this._currentText; }
  set currentText(val: string) { this._currentText = val; }

  get textBox(): HTMLTextAreaElement | HTMLInputElement | null { return this._textBox; }
  set textBox(val: HTMLTextAreaElement | HTMLInputElement | null) { this._textBox = val; }

  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;
    if (!(diagram as any).allowTextEdit) return false;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;
    if (!lastInput.leftButton) return false;
    if (lastInput.clickCount < 2) return false;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const obj = diagram.findObjectAt(point);
    if (obj instanceof TextBlock && obj.editable) {
      return true;
    }

    return false;
  }

  doActivate(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;

    const lastInput = (diagram as any).lastInput;
    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const obj = diagram.findObjectAt(point);

    if (!(obj instanceof TextBlock)) return;

    this._textBlock = obj;
    this._defaultText = obj.text;
    this._currentText = obj.text;

    const docBounds = obj.getDocumentBounds();
    const viewPt = diagram.transformDocToView(new Point(docBounds.x, docBounds.y));
    const scale = (diagram as any).scale || 1;
    const viewW = docBounds.width * scale;
    const viewH = docBounds.height * scale;

    const div = diagram.div;
    if (!div) return;

    let el: HTMLTextAreaElement | HTMLInputElement;
    if (obj.isMultiline) {
      el = document.createElement('textarea');
    } else {
      el = document.createElement('input');
      el.type = 'text';
    }

    el.value = obj.text;
    el.style.position = 'absolute';
    el.style.left = viewPt.x + 'px';
    el.style.top = viewPt.y + 'px';
    el.style.width = Math.max(viewW, 50) + 'px';
    el.style.height = Math.max(viewH, 20) + 'px';
    el.style.font = obj.font;
    el.style.textAlign = obj.textAlign as CanvasTextAlign;
    el.style.zIndex = '10000';
    el.style.border = '1px solid #4a90d9';
    el.style.outline = 'none';
    el.style.padding = '0px';
    el.style.margin = '0px';
    el.style.resize = 'none';
    el.style.overflow = 'hidden';
    el.style.boxSizing = 'border-box';
    el.style.backgroundColor = 'white';

    const stroke = obj.stroke;
    if (typeof stroke === 'string') {
      el.style.color = stroke;
    } else if (Brush.isBrush(stroke)) {
      el.style.color = 'black';
    }

    if (obj.isMultiline) {
      (el as HTMLTextAreaElement).style.lineHeight = '1.2';
      (el as HTMLTextAreaElement).style.whiteSpace = 'pre-wrap';
      (el as HTMLTextAreaElement).style.wordWrap = 'break-word';
    }

    div.appendChild(el);
    this._textBox = el;

    el.focus();
    el.select();

    this.startTransaction(this.name);
  }

  doKeyDown(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const key = lastInput.key;

    if (key === 'Escape') {
      this.cancelText();
      lastInput.handled = true;
      return;
    }

    if (key === 'Tab') {
      this.acceptText();
      lastInput.handled = true;
      return;
    }

    if (key === 'Enter') {
      if (this._textBlock && this._textBlock.isMultiline && !lastInput.shift) {
        return;
      }
      this.acceptText();
      lastInput.handled = true;
      return;
    }
  }

  doDeactivate(): void {
    this._removeElement();
    this._textBlock = null;
    super.doDeactivate();
  }

  acceptText(): void {
    if (this._textBox && this._textBlock) {
      this._currentText = this._textBox.value;
      const diagram = this.diagram;
      if (diagram) {
        const part = (this._textBlock as any).part;
        if (part && part.data) {
          const bindings: any[] = (this._textBlock as any)._bindings || [];
          const textBinding = bindings.find((b: any) => b.targetProperty === 'text');
          if (textBinding) {
            diagram.model.setDataProperty(part.data, textBinding.sourceProperty || 'text', this._currentText);
          } else {
            this._textBlock.text = this._currentText;
          }
        } else {
          this._textBlock.text = this._currentText;
        }
        diagram.raiseDiagramEvent('TextEdited', this._textBlock, this._defaultText, this._currentText);
      }
      this.transactionResult = this.name;
    }
    this._removeElement();
    this.stopTransaction();
    this.stopTool();
  }

  cancelText(): void {
    if (this._textBlock) {
      this._textBlock.text = this._defaultText;
    }
    this._removeElement();
    this.stopTool();
  }

  private _removeElement(): void {
    if (this._textBox) {
      const parent = this._textBox.parentNode;
      if (parent) {
        parent.removeChild(this._textBox);
      }
      this._textBox = null;
    }
  }
}
