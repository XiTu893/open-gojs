import * as openGojs from '../../src/index';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const officialGojs = require('gojs');

export interface NodePos {
  key: any;
  location: { x: number; y: number };
  position: { x: number; y: number };
}

export interface DiagramResult {
  nodes: NodePos[];
}

/**
 * Create a div in the global jsdom document (provided by vitest's jsdom environment).
 * Using the global document is important so that official GoJS recognizes the div.
 */
export function makeDom(html = '<div id="diagramDiv" style="width:800px;height:600px"></div>'): any {
  // Ensure a fresh host element in the global document.
  const container = document.createElement('div');
  container.innerHTML = html;
  const div = container.firstChild as HTMLDivElement;
  document.body.appendChild(div);
  return {
    window,
    document,
    div,
  };
}

export function getDiv(dom: any): HTMLDivElement {
  return dom.div;
}

/**
 * Build a diagram using the given gojs namespace (either official or open-gojs)
 * with the standard basic.html scenario and return the node positions.
 */
export function runBasicScenario(go: any, div: any): DiagramResult {
  const diagram = new go.Diagram(div);

  diagram.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
    .add(
      new go.Shape('RoundedRectangle', { fill: 'white' }).bind('fill', 'color'),
      new go.TextBlock({ margin: 6 }).bindTwoWay('text', 'text')
    );

  diagram.model = new go.GraphLinksModel(
    [
      { key: 1, text: 'Alpha', color: 'lightblue' },
      { key: 2, text: 'Beta', color: 'orange' },
      { key: 3, text: 'Gamma', color: 'lightgreen' },
      { key: 4, text: 'Delta', color: 'pink' },
    ],
    []
  );

  const nodes: NodePos[] = [];
  const it = diagram.nodes;
  while (it.next()) {
    const n = it.value;
    const loc = n.location;
    const pos = n.position;
    nodes.push({
      key: n.data?.key,
      location: { x: Math.round(loc.x * 1000) / 1000, y: Math.round(loc.y * 1000) / 1000 },
      position: { x: Math.round(pos.x * 1000) / 1000, y: Math.round(pos.y * 1000) / 1000 },
    });
  }
  return { nodes };
}

export interface CompareResult {
  description: string;
  official: any;
  open: any;
  officialError?: string;
  openError?: string;
}

/**
 * Run a scenario against both the official GoJS and Open-GoJS.
 * Returns a comparison report.
 */
export function compare(description: string, scenario: (go: any, div: any) => any): CompareResult {
  const officialDom = makeDom();
  const openDom = makeDom();
  const officialDiv = getDiv(officialDom);
  const openDiv = getDiv(openDom);

  let official: any;
  let open: any;
  let officialError: string | undefined;
  let openError: string | undefined;

  try {
    official = scenario(officialGojs, officialDiv);
  } catch (e: any) {
    officialError = String(e && e.message ? e.message : e);
  }
  try {
    open = scenario(openGojs, openDiv);
  } catch (e: any) {
    openError = String(e && e.message ? e.message : e);
  }

  // Clean up divs
  try { officialDiv.remove(); } catch {}
  try { openDiv.remove(); } catch {}

  return { description, official, open, officialError, openError };
}

export { officialGojs, openGojs };