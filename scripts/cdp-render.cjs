/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

// The diagram-setup code shared by both pages.
// It assumes `window.go` is defined, creates the basic.html diagram in a 400x400 div,
// waits for render, then writes a summary to window.__result.
const SETUP = `
window.__initBasic = function() {
  var myDiagram = new go.Diagram('myDiagramDiv', {
    'clickCreatingTool.archetypeNodeData': { text: 'Node', color: 'white' },
    'undoManager.isEnabled': true
  });
  myDiagram.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
    .add(
      new go.Shape('RoundedRectangle', { fill: 'white', portId: '', cursor: 'pointer', fromLinkable: true, toLinkable: true }).bind('fill', 'color'),
      new go.TextBlock({ font: 'bold 14px sans-serif', stroke: '#333', margin: 6, isMultiline: false, editable: true }).bindTwoWay('text', 'text')
    );
  myDiagram.linkTemplate = new go.Link({ toShortLength: 3 })
    .add(
      new go.Shape({ strokeWidth: 2 }).bind('stroke', 'color'),
      new go.Shape({ toArrow: 'Standard', stroke: null }).bind('fill', 'color')
    );
  myDiagram.groupTemplate = new go.Group('Vertical', { selectionObjectName: 'PANEL', ungroupable: true })
    .add(
      new go.TextBlock({ font: 'bold 19px sans-serif', isMultiline: false, editable: true }).bindTwoWay('text', 'text').bind('stroke', 'color'),
      new go.Panel('Auto', { name: 'PANEL' }).add(
        new go.Shape('Rectangle', { fill: 'rgba(128,128,128,0.2)', stroke: 'gray', strokeWidth: 3, portId: '', cursor: 'pointer' }),
        new go.Placeholder({ margin: 10, background: 'transparent' })
      )
    );
  var nodeDataArray = [
    { key: 1, text: 'Alpha', color: 'lightblue' },
    { key: 2, text: 'Beta', color: 'orange' },
    { key: 3, text: 'Gamma', color: 'lightgreen', group: 5 },
    { key: 4, text: 'Delta', color: 'pink', group: 5 },
    { key: 5, text: 'Epsilon', color: 'green', isGroup: true }
  ];
  var linkDataArray = [
    { from: 1, to: 2, color: 'blue' },
    { from: 2, to: 2 },
    { from: 3, to: 4, color: 'green' },
    { from: 3, to: 1, color: 'purple' }
  ];
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  setTimeout(function() {
    window.__result = collectSummary(myDiagram);
  }, 600);
};

window.collectSummary = function(myDiagram) {
  var nodes = [];
  var it = myDiagram.nodes;
  while (it.next()) {
    var n = it.value;
    var ab = n.getDocumentBounds();
    nodes.push({
      key: n.data && n.data.key,
      loc: [Math.round(n.location.x), Math.round(n.location.y)],
      ab: [Math.round(ab.x), Math.round(ab.y), Math.round(ab.width), Math.round(ab.height)]
    });
  }
  var links = [];
  var lit = myDiagram.links;
  while (lit.next()) {
    var l = lit.value;
    var pts = [];
    var pit = l.points;
    if (pit && pit.iterator) { var p = pit.iterator; while (p.next()) pts.push([Math.round(p.value.x), Math.round(p.value.y)]); }
    else if (pit && pit.next) { while (pit.next()) pts.push([Math.round(pit.value.x), Math.round(pit.value.y)]); }
    links.push({ from: l.data && l.data.from, to: l.data && l.data.to, pts: pts });
  }
  var groups = [];
  var git = myDiagram.nodes;
  while (git.next()) {
    var g = git.value;
    if (!(g instanceof go.Group)) continue;
    var panel = null;
    var ph = null;
    var title = null;
    var els = g.elements;
    if (els && els.next) { while (els.next()) { var el = els.value; if (el instanceof go.TextBlock && !title) title = el; if (el instanceof go.Panel) { panel = el; if (el.elements) { var pi = el.elements; while (pi.next()) { var pe = pi.value; if (pe instanceof go.Placeholder) ph = pe; } } } } }
    var pab = panel ? panel.getDocumentBounds() : null;
    var phab = ph ? ph.getDocumentBounds() : null;
    var tab = title ? title.getDocumentBounds() : null;
    groups.push({
      key: g.data && g.data.key,
      groupLoc: [Math.round(g.location.x), Math.round(g.location.y)],
      panel: pab ? [Math.round(pab.x - g.location.x), Math.round(pab.y - g.location.y), Math.round(pab.width), Math.round(pab.height)] : null,
      ph: phab ? [Math.round(phab.x - g.location.x), Math.round(phab.y - g.location.y), Math.round(phab.width), Math.round(phab.height)] : null,
      title: tab ? [Math.round(tab.x - g.location.x), Math.round(tab.y - g.location.y), Math.round(tab.width), Math.round(tab.height)] : null
    });
  }
  return { nodes: nodes, links: links, groups: groups };
};
`;

function htmlPage() {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
    '<div id="myDiagramDiv" style="width:400px;height:400px"></div>' +
    '<script>' + SETUP + '</script></body></html>';
}

function waitForResult(page, timeout) {
  return new Promise(function (resolve, reject) {
    const start = Date.now();
    (function poll() {
      page.evaluate(function () { return window.__result; }).then(function (r) {
        if (r) return resolve(r);
        if (Date.now() - start > timeout) return reject(new Error('timeout waiting for result'));
        setTimeout(poll, 100);
      }).catch(reject);
    })();
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=500,500'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 500 });

  const localHtml = 'data:text/html;base64,' + Buffer.from(htmlPage()).toString('base64');
  const officialHtml = 'data:text/html;base64,' + Buffer.from(htmlPage()).toString('base64');

  // --- Local open-gojs ---
  await page.goto(localHtml);
  await page.addScriptTag({ path: path.join(__dirname, '..', 'dist', 'open-gojs.umd.js') });
  await page.evaluate(function () { window.__initBasic(); });
  const localResult = await waitForResult(page, 8000);
  const localShot = await page.screenshot({ encoding: 'base64' });

  // --- Official gojs from CDN ---
  await page.goto(officialHtml);
  await page.addScriptTag({ url: 'https://unpkg.com/gojs@4.0.4/release/go-debug.js' });
  await page.evaluate(function () { window.__initBasic(); });
  const officialResult = await waitForResult(page, 8000);
  const officialShot = await page.screenshot({ encoding: 'base64' });

  await browser.close();

  const out = {
    official: {
      result: officialResult,
      shot: officialShot,
    },
    local: {
      result: localResult,
      shot: localShot,
    },
  };
  fs.writeFileSync(path.join('C:\\Users\\zeus-zzp\\AppData\\Local\\Temp\\opencode', 'cdp-compare.json'), JSON.stringify(out));
  console.log('WROTE cdp-compare.json');
  console.log('OFFICIAL NODES:', JSON.stringify(out.official.result.nodes, null, 1));
  console.log('LOCAL NODES:', JSON.stringify(out.local.result.nodes, null, 1));
  console.log('OFFICIAL GROUPS:', JSON.stringify(out.official.result.groups, null, 1));
  console.log('LOCAL GROUPS:', JSON.stringify(out.local.result.groups, null, 1));
})().catch(e => { console.error('ERR', e && e.message ? e.message : e); process.exit(1); });