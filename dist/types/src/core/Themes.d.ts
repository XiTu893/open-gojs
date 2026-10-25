import { Margin } from './Margin';
/**
 * 官方 `Themes`（go.d.ts: class Themes）—— ThemeManager 内置的 light / dark 两套主题。
 * 值与官方 go.js 里的 `Themes.Light` / `Themes.Dark` 逐项一致。
 */
export declare class Themes {
    static readonly className: string;
    static readonly Light: {
        colors: {
            text: string;
            comment: string;
            link: string;
            group: string;
            outline: string;
            selection: string;
            div: string;
            gridMinor: string;
            gridMajor: string;
            overviewBox: string;
            tempLink: string;
            tempPort: string;
            adornmentFill: string;
            adornmentStroke: string;
            dragSelect: string;
        };
        fonts: {
            normal: string;
            bold: string;
        };
        numbers: {
            group: number;
            selection: number;
        };
        margins: {
            group: Margin;
        };
        arrowheads: {
            toArrow: string;
        };
    };
    static readonly Dark: {
        colors: {
            text: string;
            comment: string;
            link: string;
            group: string;
            outline: string;
            selection: string;
            div: string;
            gridMinor: string;
            gridMajor: string;
            overviewBox: string;
            tempLink: string;
            tempPort: string;
            adornmentFill: string;
            adornmentStroke: string;
            dragSelect: string;
        };
        fonts: {
            normal: string;
            bold: string;
        };
        numbers: {
            group: number;
            selection: number;
        };
        margins: {
            group: Margin;
        };
        arrowheads: {
            toArrow: string;
        };
    };
}
