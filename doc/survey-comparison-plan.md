# 167 样例全量对比结论与改进方案

测量方式（可复现）：
- 我方：串行打开 `examples/*.html`（`temp/_survey_seq.cjs`，等到画布有内容），采集 canvas 非白像素、pageerror。
- 基线：HEAD(`7b2741a`) 的 dist 抽出到 `temp/base/`，页面在 `temp/_base/`，同样串行测量 → `temp/survey/report_base.json`。
- 官方：`temp/_cmp_*.html`（加载 `node_modules/gojs/release/go-debug.js`）→ `temp/survey/report.json` 中 `official` 字段。
- 像素差：`temp/_pixdiff.cjs` → `temp/survey/pixdiff.json`。
- 分类：`temp/_classify.cjs` → `temp/survey/classify.md`。
- 注意：多页并发时 rAF 不触发会导致我方画布空白（官方有兜底），故所有测量必须串行；Windows 下无 `/dev/null`，日志一律写入 `temp/*.log`。

分类统计（ours vs 官方 vs HEAD 基线，共 167）：

| 状态 | 数量 | 含义 |
|---|---|---|
| REGRESSION_ERR | 21 | 基线无错、现在报错 |
| BOTH_ERR_CHANGED | 26 | 基线有错、现在换了别的错（多为回归） |
| BOTH_ERR_SAME | 48 | 基线就有的长期缺失 |
| REGRESSION_LOW | 1 | familyTree（base=0.96 → 现在 0.27） |
| BLANK_BOTH_OR_NEW | 6 | 我方空白且基线也空白 |
| LOW_OURS | 22 | 非白像素 ratio<0.5（图表类居多） |
| FADE | 13 | ratio 0.5~0.8 |
| EXTRA_OURS | 5 | ratio>1.6（过量渲染） |
| OK / EXTRA / OFFICIAL_BLANK / FIXED_ERR | 17/5/1/7 | 达标 / 反超 / 官方空白 / 已修复 |

---

## 阶段 1：回归修复（新增错误，优先级最高）

### R1 `bindTwoWay` 参数顺序颠倒 —— 约 30 个样例
- 位置：`src/view/GraphObject.ts:511`
- 现状：`(targetProperty, sourceProperty?, backConversion?, conversion?)`，第 3、4 参颠倒。
- 官方：`bindTwoWay(targetprop, sourceprop?, conv?, backconv?)`（`go.d.ts:17969`），第 3 参是 source→target 的 `conv`。
- 后果：`records.html` 的 `.bindTwoWay('location','loc', go.Point.parse, go.Point.stringify)` 把 `Point.stringify` 当 converter → 对字符串 `'x y'` 取 `.x` → `Cannot read properties of undefined (reading 'toString')`。
- 连带：`bind()` 官方有第 4 参 `backconv`（可单独把绑定变成 TwoWay），我方 `bind` 只接 3 参 → 一并补齐。
- 受影响（报错）：sharedStates stateChart planogram pipes grafcet stateChartIncremental adornmentButtons treeMapper records dragOutFields selectableFields sequenceDiagram dragDropFields dragUnoccupied linksToLinks networkConfig selectablePorts industrialMonitor absolute mindMap kanban belts seatingChart network controlGauges。
- 验证：修后 `Cannot read properties of undefined (reading 'toString')` 归零。

### R2 `_part` 自引用 → `raiseChangedEvent` 无限递归 —— 9 个样例
- 位置：
  - `src/diagram/Diagram.ts:1236-1246 _propagatePartToChildren`：`setPart(part)` 把 Part 自身的 `_part` 指向自己。
  - `src/view/GraphObject.ts:658-674 raiseChangedEvent`：`partHandler.call(part, ...)` 未判断 `part === this` → 自调用死循环。
- 实测调用栈（`temp/_recur.cjs`）：`Node.text` 变更 → `GraphObject.raiseChangedEvent` → 同一方法 → … → 栈溢出。
- 受影响：cLayout decisionTree familyTreeJP fdLayout friendWheel gLayout localView tLayout venn。
- 修法（两处任选其一，推荐前者并加防御）：`_propagatePartToChildren` 不给 Part 自身设 `_part`；`raiseChangedEvent` 中 `part !== null && part !== this` 才转发给 part，否则转 diagram。
- 注意：改 `_part` 语义会影响 `GraphObject.part` getter 用到的样例，需跑全量回归。

### R3 familyTree 布局回归（ratio 0.27，基线 0.96）
- 现象：`TreeLayout(angle:90, layerStyle:LayerUniform, treeStyle:LastParents, alternate*)` 输出 Y 到 10676/10840，文档高 1286 → 视口跑到 y=10052。
- 疑点：未提交的 `src/layout/TreeLayout.ts`（+278 行，phase 6/7）改动。
- 方法：对 TreeLayout 改动做分块回退二分，定位引入点后按官方实现修正；回归样例还有 familyTreeJP、treeView、umlClass 等。

### R4 其余零散回归（逐个定位）
- `regrouping`：`Rect constructor ... -18.52`（负宽度，measure 结果未 clamp）。
- `doubleCircle`：`t.iterator is not a function`（应使用项目自带 `Iterable/Iterator`，不能假设对方有原生迭代器）。
- `sankey`：`it.next is not a function`（同上，`List.iterator` vs `iteratorValues` 用法错）。
- `pipeTree`：`undefined (reading 'layoutDiagram')`；`virtualized*`：`remove/div`；`relationships/grouping`：`model.addLinkData is not a function`；`pinchResizing`：`defaultTool`；`canvases`：`element`；`incrementalTree`：`isTreeLeaf`；`dynamicPorts`：`null.add`；`spacingZoom`：`pt.copy`；`pathAnimation`：`getPointAlongPath`。

### 阶段 1 验收
`npm run verify` 通过 + 串行 survey 重测 → `REGRESSION_ERR`/`BOTH_ERR_CHANGED` 显著下降、`toString`/`call stack` 两类错误归零、familyTree ratio ≥0.9。

---

## 阶段 2：渲染调度健壮性（真实空白风险）

- 现象：`src/diagram/Diagram.ts:894 requestUpdate` 只用 `requestAnimationFrame` 排漆；隐藏/后台页 rAF 不触发 → 画布永远空白（实测 `visibilityState=hidden` 时 rAF 0 次；官方同样条件下能画）。
- 方案：首帧同步绘制（`_needsRender` 首次直接 `_renderLoop()`）或 rAF 之外加 `setTimeout(…, 0/16)` 兜底；保持与官方"批量合并到下一帧"语义一致。
- 收益：消除样例测量/真实使用的首屏空白，也修复 BLANK_BOTH_OR_NEW 中的 6 个样例。

---

## 阶段 3：长期缺失 API（BOTH_ERR_SAME 48）

按改动量从小到大：
1. `RowColumnDefinition` 链式 API：`addColumnDefinition(...).add()` / `.addColumnDefinition()` / `addRowDefinition(...).addRowDefinition()`（Accessibility orgChartEditor orgChartExtras PERT tournament gantt connectionBoxNode magnifier orgChartAssistants addRemoveColumns 等 ~10 例）。
2. 缺失导出/类：`Inspector`、`RadialLayout`、`DoubleTreeLayout`、`ParallelLayout`、`OrthogonalLinkReshapingTool`、`Quadtree`、`NodeLabelDraggingTool`、`DrawCommandHandler`、`HyperlinkText`、`Modern`、`CheckBox`、`require`（样例用 CommonJS 加载子样例）、`AnimationManager.defineAnimationEffect`。
3. `swimLanes`：`part.getDocumentBounds is not a function`。
4. `Panel.add: argument must be a GraphObject`、`spacingZoom pt.copy`、`htmlInteraction undefined(diagram)`、`icons undefined(bindObject)`、`test-* undefined(Diagram)`。

---

## 阶段 4：渲染质量（LOW_OURS 22 / FADE 13 / EXTRA_OURS 5）

- 偏少（画的内容比官方少）：animatedFocus thermometer scrollModes DOMTree faultTree swimBands dynamicPieChart parseTree donutCharts multiNodePathLinks test-group taperedLinks multiArrow twoHalves sequentialFunction multiColorLinks conceptMap pieCharts customExpandCollapse radialAdornment test-graduated candlestickCharts。
  - 主线：图表类（barCharts 已修：`CanvasRenderer.renderShape` 按 stroke 内缩 1px）→ 推广到 pie/donut/thermometer/candlestick 等；`conceptMap`（node.location=NaN、ForceDirectedLayout 输出异常）单列。
- 偏淡（ratio 0.5~0.8）：twoDiagrams umlClass visualTree gestureBehavior hoverButtons test-jumpover visualTreeGrouping customContextMenu updateDemo sparklineGraphs dimensioning comments macros。
- 过量（ratio>1.6）：dataFlow dataFlowVertical ldLayout(5.37) roundedGroups(8.84) dataVisualization → 多画了背景/重复绘制。

---

## 执行规则

1. 每阶段/每批次修改后：`npm run build` → `npm run verify` → 串行 survey（`node temp/_survey_seq.cjs`）→ `node temp/_classify.cjs`，对比状态数量，确认无新增回归再进入下一项。
2. 集合类一律使用项目自带 `List/Map/Set/Iterable`（`src/core/*`），禁止原生 `Map/Set/Iterator`；`GraphObject`/`Shape` 内部映射沿用 `Map as Dict` 惯例。
3. Windows 环境：不使用 `/dev/null`、`ls|head` 等 Linux 习惯；日志输出到 `temp/*.log`。
4. 修改 `src/**` 后必须重新构建 dist，测量脚本加载的是 `dist/open-gojs.umd.js`。
