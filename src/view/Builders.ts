import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Shape } from './Shape';
import { TextBlock } from './TextBlock';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Point } from '../core/Point';
import { Margin } from '../core/Margin';
import { Adornment } from './Adornment';
import { Node } from './Node';
import { Group } from './Group';
import { PanelAuto, PanelVertical, StretchHorizontal } from '../core/EnumValues';

function initBuilders(): void {
  const GO = GraphObject;

  GO.defineBuilder('Button', (args: any[]) => {
    const buttonFillNormal = '#f5f5f5';
    const buttonStrokeNormal = '#737373';
    const buttonFillOver = '#d4d4d4';
    const buttonStrokeOver = '#737373';
    const buttonFillDisabled = '#a3a3a3';
    const paddingHorizontal = 2.76142374915397;
    const paddingVertical = 2.761423749153969;

    const button = new Panel(PanelAuto, {
      isActionable: true,
      cursor: 'pointer',
    } as any);

    (button as any).attach({
      '_buttonFillNormal': undefined,
      '_buttonStrokeNormal': undefined,
      '_buttonFillOver': buttonFillOver,
      '_buttonStrokeOver': buttonStrokeOver,
      '_buttonFillDisabled': buttonFillDisabled,
    });

    button.add(new Shape('RoundedRectangle', {
      name: 'ButtonBorder',
      spot1: new Spot(0, 0, paddingHorizontal, paddingVertical),
      spot2: new Spot(1, 1, -paddingHorizontal, -paddingVertical),
      parameter1: 2,
      fill: buttonFillNormal,
      stroke: buttonStrokeNormal,
    } as any));

    (button as any).mouseEnter = (e: any, btn: any) => {
      if (!(btn as any).isEnabledObject || !(btn as any).isEnabledObject()) return;
      if (!(btn instanceof Panel)) return;
      const shape = btn.findObject('ButtonBorder');
      if (shape instanceof Shape) {
        if ((btn as any)['_buttonFillNormal'] === undefined)
          (btn as any)['_buttonFillNormal'] = shape.fill;
        shape.fill = (btn as any)['_buttonFillOver'];
        if ((btn as any)['_buttonStrokeNormal'] === undefined)
          (btn as any)['_buttonStrokeNormal'] = shape.stroke;
        shape.stroke = (btn as any)['_buttonStrokeOver'];
      }
    };

    (button as any).mouseLeave = (e: any, btn: any) => {
      if (!(btn instanceof Panel)) return;
      const shape = btn.findObject('ButtonBorder');
      if (shape instanceof Shape) {
        if ((btn as any)['_buttonFillNormal'] !== undefined)
          shape.fill = (btn as any)['_buttonFillNormal'];
        if ((btn as any)['_buttonStrokeNormal'] !== undefined)
          shape.stroke = (btn as any)['_buttonStrokeNormal'];
      }
    };

    return button;
  });

  GO.defineBuilder('TreeExpanderButton', (args: any[]) => {
    const button = GO.build('Button') as Panel;
    (button as any).attach({
      '_treeExpandedFigure': 'MinusLine',
      '_treeCollapsedFigure': 'PlusLine',
      visible: false,
    });

    const icon = new Shape('MinusLine', {
      name: 'ButtonIcon',
      stroke: '#0a0a0a',
      strokeWidth: 2,
      desiredSize: new Size(8, 8),
    } as any);

    icon.bindObject('figure', 'isTreeExpanded', (exp: boolean, shape: any) => {
      const but = shape.panel;
      return exp ? but['_treeExpandedFigure'] : but['_treeCollapsedFigure'];
    });

    button.add(icon);
    button.bindObject('visible', 'isTreeLeaf', (leaf: boolean) => !leaf);

    (button as any).click = (e: any, btn: any) => {
      let node = btn.part;
      if (node instanceof Adornment) node = (node as any).adornedPart;
      if (!(node instanceof Node)) return;
      const diagram = node.diagram;
      if (!diagram) return;
      const cmd = diagram.commandHandler;
      if (node.isTreeExpanded) {
        if (!cmd.canCollapseTree(node)) return;
      } else {
        if (!cmd.canExpandTree(node)) return;
      }
      e.handled = true;
      if (node.isTreeExpanded) {
        cmd.collapseTree(node);
      } else {
        cmd.expandTree(node);
      }
    };

    return button;
  });

  GO.defineBuilder('SubGraphExpanderButton', (args: any[]) => {
    const button = GO.build('Button') as Panel;
    (button as any).attach({
      '_subGraphExpandedFigure': 'MinusLine',
      '_subGraphCollapsedFigure': 'PlusLine',
    });

    const icon = new Shape('MinusLine', {
      name: 'ButtonIcon',
      stroke: '#0a0a0a',
      strokeWidth: 2,
      desiredSize: new Size(8, 8),
    } as any);

    icon.bindObject('figure', 'isSubGraphExpanded', (exp: boolean, shape: any) => {
      const but = shape.panel;
      return exp ? but['_subGraphExpandedFigure'] : but['_subGraphCollapsedFigure'];
    });

    button.add(icon);

    (button as any).click = (e: any, btn: any) => {
      let group = btn.part;
      if (group instanceof Adornment) group = (group as any).adornedPart;
      if (!(group instanceof Group)) return;
      const diagram = group.diagram;
      if (!diagram) return;
      const cmd = diagram.commandHandler;
      if (group.isSubGraphExpanded) {
        if (!cmd.canCollapseSubGraph(group)) return;
      } else {
        if (!cmd.canExpandSubGraph(group)) return;
      }
      e.handled = true;
      if (group.isSubGraphExpanded) {
        cmd.collapseSubGraph(group);
      } else {
        cmd.expandSubGraph(group);
      }
    };

    return button;
  });

  GO.defineBuilder('PanelExpanderButton', (args: any[]) => {
    const eltname = GO.takeBuilderArgument(args, 'COLLAPSIBLE');
    const button = GO.build('Button') as Panel;
    (button as any).attach({
      '_buttonExpandedFigure': 'M0 0 M0 6 L4 2 8 6 M8 8',
      '_buttonCollapsedFigure': 'M0 0 M0 2 L4 6 8 2 M8 8',
      'ButtonBorder.fill': 'rgba(0, 0, 0, 0)',
      '_buttonFillNormal': 'rgba(0, 0, 0, 0)',
      'ButtonBorder.stroke': null,
      '_buttonStrokeNormal': null,
      '_buttonFillOver': 'rgba(0, 0, 0, .2)',
      '_buttonStrokeOver': null,
    });

    const icon = new Shape({ name: 'ButtonIcon', strokeWidth: 2 } as any);
    icon.bindObject('geometryString', 'visible', (vis: boolean) => {
      return vis ? (button as any)['_buttonExpandedFigure'] : (button as any)['_buttonCollapsedFigure'];
    }, undefined, eltname);

    button.add(icon);

    const border = button.findObject('ButtonBorder');
    if (border instanceof Shape) {
      border.stroke = null;
      border.fill = 'rgba(0, 0, 0, 0)';
    }

    (button as any).click = (e: any, btn: any) => {
      if (!(btn instanceof Panel)) return;
      const diagram = btn.diagram;
      if (!diagram) return;
      if (diagram.isReadOnly) return;
      let elt: any = btn.findBindingPanel();
      if (elt === null) elt = btn.part;
      if (elt !== null) {
        const pan = elt.findObject(eltname);
        if (pan !== null) {
          e.handled = true;
          diagram.startTransaction('Collapse/Expand Panel');
          pan.visible = !pan.visible;
          diagram.commitTransaction('Collapse/Expand Panel');
        }
      }
    };

    return button;
  });

  GO.defineBuilder('ToolTip', (args: any[]) => {
    return new Adornment(PanelAuto, {
      isShadowed: true,
      shadowColor: 'rgba(0, 0, 0, .4)',
      shadowOffset: new Point(0, 2),
    } as any).add(
      new Shape('RoundedRectangle', {
        name: 'Border',
        parameter1: 1,
        fill: '#f5f5f5',
        strokeWidth: 0,
        spot1: new Spot(0, 0, 4, 6),
        spot2: new Spot(1, 1, -4, -4),
      } as any)
    );
  });

  GO.defineBuilder('ContextMenu', (args: any[]) => {
    const menu = new Adornment(PanelVertical, {
      background: '#f5f5f5',
      isShadowed: true,
      shadowColor: 'rgba(0, 0, 0, .4)',
      shadowOffset: new Point(0, 2),
    } as any);

    menu.bindObject('background', '', (ad: any) => {
      const part = ad.adornedPart;
      if (part !== null && ad.hasPlaceholder()) return null;
      return '#f5f5f5';
    });

    return menu;
  });

  GO.defineBuilder('ContextMenuButton', (args: any[]) => {
    const button = GO.build('Button') as Panel;
    (button as any).stretch = StretchHorizontal;
    const border = button.findObject('ButtonBorder');
    if (border instanceof Shape) {
      border.figure = 'Rectangle';
      border.strokeWidth = 0;
      border.spot1 = new Spot(0, 0, 4, 6);
      border.spot2 = new Spot(1, 1, -4, -4);
    }
    return button;
  });
}

initBuilders();
