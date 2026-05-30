import { Tool } from './Tool';
import { TextBlock } from '../view/TextBlock';
export declare class TextEditingTool extends Tool {
    private _textBlock;
    private _defaultText;
    private _currentText;
    private _textBox;
    constructor();
    get textBlock(): TextBlock | null;
    set textBlock(val: TextBlock | null);
    get defaultText(): string;
    set defaultText(val: string);
    get currentText(): string;
    set currentText(val: string);
    get textBox(): HTMLTextAreaElement | HTMLInputElement | null;
    set textBox(val: HTMLTextAreaElement | HTMLInputElement | null);
    canStart(): boolean;
    doActivate(): void;
    doKeyDown(): void;
    doDeactivate(): void;
    acceptText(): void;
    cancelText(): void;
    private _removeElement;
}
