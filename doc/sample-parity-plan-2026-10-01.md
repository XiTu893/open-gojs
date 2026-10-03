# 对标 gojs.net/latest/samples 全量样例：对照运行 → 找差异 → 修正（2026-10-01 起）

> 上一篇：`doc/sample-parity-2026-09-30.md`（已修 16 项、工具链、噪声分档结论）。
> 本文是**执行计划**：以官方索引为权威清单，把「对照运行 → 找差异 → 修正」跑成闭环，
> 直到 228 个条目全部有读数、且修复项全部验收。
>
> 依据 Agent.md：**不跑 vitest**，验证只用 `tsc --noEmit` / `rollup -c` / `npm run test:cdp` + `temp/survey/` 下的 CDP 脚本。

---

## 0. 权威清单与覆盖现状（2026-10-01 实测）

清单来源：`https://gojs.net/latest/samples` 首页的 `href="./samples/<slug>"`，
已落盘 `temp/survey/official_index.txt`（脚本：见 §1 P0.1）。

| 集合 | 数量 | 说明 |
| --- | --- | --- |
| 官方索引条目 | **228** | 含 17 个 `layouts?layout=X` 变体 → **211 个独立样例页** |
| 官方样例页（去 layouts 变体） | **211** | |
| 已抓到官方 `jsCode` | **149** | `temp/official/samples/*.js`，manifest 157 条里 8 条失败 |
| 已进 A/B 清单 `ab_bases.txt` | **148** | 全部有本地 `examples/*.html` |
| **缺口** | **80** | 63 个官方样例页 + 17 个 layouts 变体 |
| 本地有、官方索引没有 | 1 | `industrialDiagram`（官方已改名 `industrialMonitor`，属本地遗留样例） |
| 本地 `examples/*.html` | 167 | 与官方 211 差 44 → 官方 4.0.4 新增样例，本地尚无对应页面 |

**80 个缺口的构成**（Phase 0 要逐个判定真实原因，以下按命名初判）：

| 类别 | 数量(初判) | 代表 |
| --- | --- | --- |
| A. 布局变体 `layouts?layout=X` | 17 | `circular` `doubleTree` `fishbone` `forceDirected` `grid` `layeredDigraph` `packed` `parallel` `radial` `serpentine` `spiral` `swimLane` `swimLaneCompact` `table` `tree` `treeMap` |
| B. 依赖官方 `extensions/*.js` | ~14 | `Arranging` `AvoidsLinksRouter` `BalloonLink` `DataInspector` `Dimensioning` `DrawCommandHandler` `Hyperlink` `ParallelRoute` `ZoomSlider` … |
| C. 自定义 Tool 类样例 | ~25 | `ColumnResizing` `Cropping` `DragCreating` `GeometryReshaping` `GuidedDragging` `LassoSelecting` `NonRealtimeDragging` `OrthogonalLinkReshaping` `PolygonDrawing` `Rescaling` `SectorReshaping` `SnapLinkReshaping` `RotateMultiple` `ResizeMultiple` … |
| D. 官方 4.0.4 新增（本地无页面） | ~20 | `hmiOperatorScreen` `miningSim` `containerShipping` `wifiPlanner` `waferMap` `productionLine3D` `profitSankey` `publicTransportation` `security` `vendingPlanogram` `audioEditor` `fonticons` `leaflet` `pathFinder` `platformerLevelCreator` `bpmnEditor` `circuitDesigner` `interbankRisk` `saveAndLoadLocalFiles` `htmlLightBoxContextMenu` |
| E. 页面级依赖（外部库/地图/音频） | 若干 | `leaflet` `audioEditor` `canvases`(Chart.js) → 可能判为**环境不可比**，需显式标注 |

> ⚠️ 类别只是**初判**，Phase 0 抓完 jsCode 后以 `manifest.json` 的真实错误为准。

---

## 1. 方法论（沿用已验证的工具，不重造）

**主工具 `temp/survey/ab_render.cjs`**：同一份官方 `jsCode` 分别注入
`node_modules/gojs/release/go.js`（官方）与 `dist/open-gojs.umd.js`（我们），
相同 900×620 视口、相同等待时长，截图 `#myDiagramDiv` 后做像素 diff，
同时采集双方 `pageerror` 与 `documentBounds / nodes.count / links.count`。

**为什么它可信**：样例代码完全相同 → 差异只可能来自引擎实现；
官方用的是**本地 npm 包 4.0.4**（`§0 权威基准`），不依赖网络。

**读数可信度规则（P0 就要遵守，来自 2026-09-30 的教训）**：

| 档 | 样例 | 规则 |
| --- | --- | --- |
| 恒定 | `basic` `comments` `arrowheads` `orgChartStatic` `connectionBoxNode` | 3 次复跑逐位相同 → 可用单次读数 |
| 中度 | `conceptMap` `doubleCircle` `friendWheel` `contentAlign` `belts` `distances` | 判优劣**必须复跑 3 次**，取区间 |
| 重灾 | `animatedFocus` `grouping` `ruleredDiagram` `dragUnoccupied` | 含动画/异步，单次读数**无效**，只看区间或与恒定样例交叉验证 |

**回退规则**：任何修复若让**恒定样例**的 diff 上升，或让**报错样例集合**扩大 → 立即回退，
记入 `sample-parity-2026-09-30.md` §5.3（已有 10 条记录）。

---

## 2. 阶段划分

### P0 — 扩覆盖到 228（前置，没有读数就没有差异）

| # | 动作 | 产出 | 验收 |
| --- | --- | --- | --- |
| P0.1 | 新增 `temp/survey/fetch_index.cjs`：抓官方 samples 页，抽出 `./samples/<slug>` → `temp/survey/official_index.txt` | 228 条权威清单 | 数量稳定为 228（重跑一致） |
| P0.2 | 把 `sample_names.txt` 由 157 扩到全量：补齐 63 个缺失样例页 + 17 个 layouts 变体 | `temp/survey/sample_names.txt` ≥ 228 | 与 `official_index.txt` 差集 ≤ 已知 404 项 |
| P0.3 | `fetch_official.cjs` 支持 layouts 变体（`layouts?layout=circular` → 落盘 `layouts__circular.js`，文件名非法字符转义） | 17 个布局变体 jsCode | `manifest.json` 新增 17 条 |
| P0.4 | 重跑抓取，逐个记录失败原因到 `manifest.json`（no jsCode / no route chunk / 404 / 依赖 extensions） | 失败清单 | 80 个缺口全部有**明确归因** |
| P0.5 | 对 B 类样例新增 `temp/survey/fetch_exts.cjs`（已有）→ 把 `extensions/*.js` 内联进 harness；`ab_render.cjs` 增加 `--with-exts` | 扩展类样例可跑 | `Arranging`/`DataInspector` 等不再因缺类报错 |
| P0.6 | `ab_render.cjs` 支持 `layouts?layout=X`（URL query 由 harness 透传给页面，样例代码里 `location.search` 能读到） | 布局变体可跑 | 17 个变体出读数 |
| P0.7 | 全量跑一遍 `ab_render.cjs --all $(cat ab_bases.txt)`，`ab_bases.txt` 扩到全量 | **P0 基线** `ab_full_1001.log` | 228 条目全部有 diff% 或**显式标注不可比** |

**P0 不改 `src/**`**，只加工具与清单 → 不会引入回归。

### P1 — 分级与聚类（产出「差异清单」）

| # | 动作 | 产出 |
| --- | --- | --- |
| P1.1 | 新增 `temp/survey/classify_ab.cjs`：读 `ab_full_*.log`，按 **报错状态 × diff%** 分桶 | `temp/survey/classify.md` |
| P1.2 | 分桶定义 | **P0-ERR**（仅我方报错）｜**P1**（diff ≥ 20%）｜**P2**（5–20%）｜**P3**（1–5%）｜**P4**（< 1%）｜**NO-COMPARE**（环境不可比：外部库/地图/音频/404） |
| P1.3 | 每个 P0-ERR / P1 样例跑 `part_dump.cjs` 或专用探针，**按根因聚类**（沿用 `cluster_diffs.cjs` 思路，但按**引擎根因**而非样例代码根因） | 根因聚类表（目标 ≤ 15 类） |
| P1.4 | 按「影响样例数 × 可修性」给每类排序，写进本计划 §3 | **修复批次表** |

**P1 也不改 `src/**`。**

### P2+ — 按批次修复（每批一个闭环）

每批的固定流程（**缺一不可**）：

```
1. 挑一类根因 → 2. 改 src/** → 3. tsc --noEmit → 4. rollup -c（4 产物）
5. npm run test:cdp → 6. 恒定样例 A/B（basic/comments/arrowheads/orgChartStatic/connectionBoxNode）
7. 本批目标样例复跑 3 次 → 8. 全量扫描（报错集合不得扩大）
9. 记录：改动、证据、读数、回退与否 → 10. 写回 doc
```

已知的高价值批次（来自 §3 与 09-30 的遗留）：

| 批次 | 根因类别 | 预计受益样例 | 依赖 |
| --- | --- | --- | --- |
| **B1** | 报错类：`bindTwoWay` 参序 / `_part` 自引用递归 / 集合用原生 `Map/Set/Iterator` | ~40（见 `doc/survey-comparison-plan.md` R1/R2/R4） | 无 |
| **B2** | 缺失 API：`RowColumnDefinition` 链式、`Inspector`/`RadialLayout`/`DoubleTreeLayout`/`ParallelLayout` 等导出 | ~48（旧分类 BOTH_ERR_SAME） | P0-B 类扩展加载 |
| **B3** | `spreadsheet` 负宽 `Rect(4,4,-8,12)`（唯一已确认的库内真 bug） | 1 + 隐性 | 无 |
| **B4** | 连线路由：`connectionBoxNode` 第二处路由缺陷、带端口求交 | ~10 | 无 |
| **B5** | 箭头几何体剩余 47 项（`Close` 残留 / `Arc` 贝塞尔近似 / `Backward*` 镜像） | 63 个箭头差异 | 无 |
| **B6** | 布局：`LayeredDigraphLayout`(network-simplex)、`CircularLayout` 子类覆写 `commitNodes` | `beatPaths` `friendWheel` `doubleCircle` | 高风险，单独排期 |
| **B7** | 渲染：图表类（pie/donut/candlestick/thermometer）按 stroke 内缩 1px 的推广 | ~12 | 无 |
| **B8** | `Layer`/`Picture`/事件链等 09-30 已修项的回归验证 | — | 无 |

**每批结束都要更新两张表**：
- `sample-parity-2026-09-30.md` §4 指标基线（只写恒定读数或区间）
- 本计划 §4 执行台账（批号 / 状态 / 读数 / 回退记录）

---

## 3. 修复批次排序（P1 完成后回填、可调整）

> P1.4 之前此表为**预填**，依据是 09-30 的遗留 + `doc/survey-comparison-plan.md` 的旧分类；
> P1 完成后按真实聚类重排。

| 序 | 批次 | 状态 | 目标样例数 | 预期 diff 变化 |
| --- | --- | --- | --- | --- |
| 1 | B1 报错类 | 未开始 | ~40 | ERR → 有读数 |
| 2 | B2 缺失 API | 未开始 | ~48 | ERR → 有读数 |
| 3 | B3 负宽 Rect | 未开始 | 1 | `spreadsheet` 54.98 → 未知 |
| 4 | B4 连线路由 | 未开始 | ~10 | P1/P2 → P3 |
| 5 | B7 图表渲染 | 未开始 | ~12 | P1/P2 → P3 |
| 6 | B5 箭头几何 | 未开始 | 63 项 | 单元页 17/80 → ≥50/80 |
| 7 | B6 布局算法 | 未开始 | ~6 | 高风险，单独评估 |
| 8 | B8 回归验证 | 未开始 | 全量 | 报错集合不扩大 |

---

## 4. 执行台账

> 每完成一批追加一行。**只写可复现的读数**，重灾区样例必须写区间。

| 日期 | 批次 | 改动 | 读数（前 → 后） | 回退？ | 验证 |
| --- | --- | --- | --- | --- | --- |
| 2026-10-01 | P0 | `fetch_index/fetch_official/fetch_exts/ab_render` 四件套：228 条索引、`htmlContent` 抓取为 `<base>.page.html`、`externalScripts/Styles` CDN 文件下载与注入、`ab_bases.txt` 重建为 213 | 覆盖 170/228 → **228/228**（213 实测 + 16 `NO-COMPARE`）；`ERR-OURS` 63 → 53 | 否 | `classify.md` |
| 2026-10-01 | P0 重跑 | **harness 换基线**：body 从固定 `<div id="myDiagramDiv">` 换成官方 `htmlContent`，读数**整体不可与 10-01 之前的比**（div 尺寸变了，如 `basic` 900×620 → 902×402） | 恒定样例新基线：`basic 1.592` / `comments 7.553` / `arrowheads 5.345` / `orgChartStatic 8.717` / `connectionBoxNode 17.451`（各连跑 3 次逐位相同） | 否 | `ab_full_1002.log` |
| 2026-10-01 | B1-a | `Model` 类注册表：去掉 `require()`，`GraphLinksModel/TreeModel` 顶层 `Model.registerClass`；`fromJson` 支持 `go.` 前缀 + `globalThis` 回落（对齐官方 `Model.I3`） | `ERR-OURS` 53 → **36**；`STRUCT` 61 → **23**；`require is not defined` 簇 13 个归零 | 否 | `ab_full_1003.log` |
| 2026-10-01 | B1-b | `ToolManager` 工具表 `Tool[]` → `List<Tool>`（`add/insertAt/elt/setElt/count` 齐了），`_replaceToolIn` 改用 `List` API | `mouseDownTools.*` 簇 15 个归零 | 否 | `ab_full_1003.log` |
| 2026-10-01 | B1-c | `ToolManager` 补回 `get diagram()`（子类只写 `set` 会遮蔽父类 getter → 返回 `undefined` → 所有分发方法第一行早退）；新增 `Tool.toolManager` + `_syncTools()` 给后加的工具补 `diagram`；`updateAdornments` 对齐官方的 `isEnabled` 过滤 | `SectorReshaping`/`LinkShifting` 的 `null.isReadOnly` 归零；4 个样例 `l=0` → 链接数与官方一致（`LinkLabelDragging 5/12`、`PortShifting 6/7`、`systemDynamics 12/13`、`NodeLabelDragging 5/12`） | 否 | `ab_full_1003.log` |
| 2026-10-01 | B1-d | `Diagram.delayInitialization` 对齐官方：延后 1 个 macrotask 并把 diagram 作为参数传入 | `DragZooming` `undefined.model` 归零（`n` 99 → 99，`l` 仍 98 → 0） | 否 | `ab_full_1003.log` |
| 2026-10-01 | B1-e | `List` 补齐官方 `Iterator` 协议（`next/hasNext/value/key/reset`，集合方法互不影响）；`Diagram.computePartsBounds` 改为「`iterator` 是属性不是方法」的正确取法 | `it.next is not a function`（sankey/profitSankey/pipeTree）、`t.iterator is not a function`（Arranging/classHierarchy）全部归零；`STRUCT` 23 → 20 前置 | 否 | `ab_full_1004.log` |
| 2026-10-01 | B1-f | `ToolManager` 各内置工具 getter 改为**三张表全查**（原 `clickSelectingTool`/`textEditingTool` 只查 mouseDownTools → 返回 undefined）；`TextEditingTool` 补进 `mouseUpTools` 且顺序对齐官方 go.d.ts:5159 | `distances`、`audioEditor` 的 `Cannot set properties of undefined` 归零；`ERR-OURS` 36 → **27** | 否 | `ab_full_1004.log` |
| 2026-10-01 | B1-g | **Binding 静默吞异常**（对齐官方 go.js ~840959 的 `Binding.updateTarget` 把「取源值 + converter + 写属性」整段包在 `try{}catch{}`）：`Diagram._resolveBindingValue` 拆 wrapper + `_resolveBindingValueCore`，`Panel.updateTargetBindings` 的取值/赋值同样包 try/catch | `industrialDiagram` `Brush.lightenBy` 等未定义全局不再打断整个 init：`n/l` **1/0 → 19/22**（与官方一致）且 ERR 归零；`circuitDesigner` ERR 归零 | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B1-h | `Node.isTreeLeaf` 补 setter（官方 go.d.ts:24089 同时有 get/set；本项目只有 getter → 样例模板 `isTreeLeaf: false` 抛 `which has only a getter`），显式 set 后以 set 值为准，否则回落按子节点计算；`Diagram._routers` 从原生 `Set` 改成 `List`（官方 go.d.ts:13868 `get routers(): List<Router>`） | `OverviewResizing` / `incrementalTree` 从崩 → 正常渲染 **1/0**（与官方一致）；`AvoidsLinksRouter` `routers.push is not a function` 归零 → **15/26** | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B1-i | **`Geometry` 构造签名修正**：官方是 `constructor(type?: GeometryType, init?: Partial<Geometry>)`，本项目误写成 `(figures?: PathFigure\|PathFigure[])` → `new go.Geometry(go.GeometryType.Line)` 把 EnumValue 当 PathFigure 塞进 `_figures`，后续 `figure.segments.iterator` 抛 `Cannot read properties of undefined`。改为按类型分派（EnumValue→type / 数组→figures / PathFigure→add / 普通对象→init），保留旧调用兼容 | `controlGauges` ERR 归零 → **5/5**、diff 24.0% → 22.8%；`shapes` ERR 归零、diff 20.5%、`n` 245/277 | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B1 全量 | B1-a~i 之后全量重跑（213 个 base，`--all` 强制重渲染） | `ERR-OURS` 27 → **19**（21 类 → 15 类）；`STRUCT` 20 → **12**；**新增错误 0 个**，修复 8 个（`addRemoveColumns` `AvoidsLinksRouter` `circuitDesigner` `controlGauges` `incrementalTree` `industrialDiagram` `OverviewResizing` `shapes`）；恒定 5 样例读数逐位不变 | 否 | `ab_full_1005.log` + `classify.md` |
| 2026-10-01 | B2-a | **harness 兜底**：`#myDiagramDiv` 不存在时（官方 htmlContent 里容器 id 各不相同）改为「取所有 canvas 宿主 div 的并集 bbox」截图；再用 `Proxy` 的 `construct` 陷阱在样例代码执行前登记**全部** `Diagram` 实例到 `window.__diagrams`（顶层 `const myTasks` 之类不会挂 window，扫 globals 抓不到） | 5 个 `HARNESS: null.screenshot` 全部拿到读数：`containerShipping` 7.17% / `gantt` / `leaflet` / `localView` 14.3% / `updateDemo` 2.14%；全量样例第一次同时有 `n/l` 结构读数 | 否 | 定向 + 全量 |
| 2026-10-01 | B2-b | `LinkingBaseTool` 构造函数对齐官方：`temporaryLink` 改成 `layerName:'Tool'` 的蓝线双 Shape、`temporaryFromPort`/`temporaryToPort` 造洋红端口 Shape、`temporaryFromNode`/`temporaryToNode` 包住它们，并补 `portGravity`/`isUnconnectedLinkValid`/`linkingCursor`（以前这些恒为 `null`） | `leaflet` 的 `Cannot set properties of null (setting 'opacity')` 归零 → `n/l` **12/10** 与官方一致 | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B2-c | **`Diagram._measureArrangeAll` 不再跳过临时层**（官方只在算 `documentBounds` 时排除临时层）；顺带发现 `Panel._measureGraduated` 把刻度元素也并进包围盒，改成**只由 main 元素决定**面板尺寸（对齐官方 `PanelLayoutGraduated.measure`） | `gantt` 的 `Rect(0, Infinity, 0, -Infinity)` 归零；浅灰背景铺满图区的问题消失，任务条可见 | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B2-d | **`Model.set` 补官方第二个签名** `set(data, propname, val)`（go.d.ts 与 `setDataProperty` 同义）；以前只有 `set(props)`，样例 `model.set(node.data,'start',7)` 被当成批量设模型属性静默失效 | `gantt` 的 `assignTimes` 终于能填 `start`/`duration`，任务条 `x` 不再是 NaN | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B2-e | `Diagram` 的 9 个 `find*` 方法（`findPartsAt/findObjectsAt/findPartsIn/findObjectsIn/findPartsNear/findObjectsNear/findTopLevelNodesAndLinks/findTopLevelGroups/findTreeRoots`）返回类型从原生 `Set` 换成项目自带 `List`（违反本项目第 3 条硬约束，且 `Set` 没有 `each`/`has`，`findObjectsIn` 里 `parts.iterator` 直接是 `undefined`） | `gantt` 的 `roots.each(...)` 能跑（`findTreeRoots().count=1`）；`LinkLabelRouter` 的 `_a.has` 同源问题待下一批验证 | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B2 全量 | B2-a~e 之后全量重跑 | `ERR-OURS` 19 → **13**（15 类 → 13 类）；**新增错误 0 个**，修复 6 个（`containerShipping` `flowBuilder` `gantt` `leaflet` `localView` `updateDemo`）；恒定 5 样例读数仍逐位不变（`basic 1.592` / `arrowheads 5.345` / `orgChartStatic 8.717` / `comments 7.553` / `connectionBoxNode 17.451`） | 否 | `ab_full_1006.log` + `classify.md` |
| 2026-10-01 | B3-a | **新增 `src/view/PanelLayout.ts`**（官方 go.d.ts:921309 抽象基类：`measure/measureElement/arrange/arrangeElement/remeasureObject/name`），并让 `Panel` 构造第一个参数接受 `PanelLayout` 实例（`_panelLayout` 字段；**不能叫 `_layout`**，`Group` 已有同名的组布局 `_layout: Layout`，重名会让 `Group` 走进自定义分支报 `this._layout.measure is not a function`）；`_measure`/`_arrange` 里委派给自定义布局 | `PanelLayoutFlow`（扩展 `class PanelLayoutFlow extends go.PanelLayout`）从 `Class extends value undefined` → 正常渲染 **4/4**、diff **1.862%** | 否 | 定向 `ab_render.cjs` |
| 2026-10-01 | B3 全量 | B3-a 之后全量重跑 | `ERR-OURS` 13 → **12**；**新增错误 0 个**，修复 `PanelLayoutFlow`；恒定 5 样例读数逐位不变 | 否 | `ab_full_1007.log` + `classify.md` |
| 2026-10-01 | B4-a | **动画管线三处对齐官方**（belts 的传送带不动）：①`Animation` 补 `runCount`（默认 1，setter 校验 >0）+ 官方缓动名 `EaseInOutQuad/EaseInQuad/EaseOutQuad/EaseInExpo/EaseOutExpo`；②`start()` 自己从被动画对象反查 `diagram.animationManager` 注册（官方 `start()` 里 `isRunning=true` 早于注册，顺序反了会被 `updateAnimation` 当成已结束过滤掉），`add/stop` 返回 `this`；③`AnimationManager` 补 `unregisterAnimation`/`activeAnimations`，`_startTicking` 改成排下一帧而不是同步先跑一次；`update()` 按 `runCount` 循环（换轮时 `_startTime = now`，写 `now - dur` 会卡在终值） | belts 传送带实测动起来：`strokeDashOffset` 36→0→36 循环；`comments` diff **7.553% → 4.378%**（big 4.225% → 1.152%） | 否 | `temp/survey/belts_anim.cjs` |
| 2026-10-01 | B4-b | **`Diagram._addNodeForData`/`_addLinkForData` 把数据的 category 落到 `part.category`**（官方 `PartManager._addPartForData` 的 `s.sr = e`）。此前 `node.category` 恒为 `''`，`if (node.category !== 'Belt') return;` 这类样例代码直接全部跳过 | belts 的 2 个 Belt 节点能被识别；`timeline` 的 `No node of category 'Line' for TimelineLayout` 归零（diff 11.96% → 17.49%，`l` 仍 0，待后续查链接） | 否 | 定向 |
| 2026-10-01 | B4-c | **harness 加固**：①`protocolTimeout: 60000`；②关页面前 `animationManager.isEnabled = false`（无限循环动画的 rAF 会把浏览器拖到 Navigation timeout，`security` 就这么挂过）；③新增 `temp/survey/slow.txt` 列出病态样例（`virtualizedTreeLayout` / `virtualizedForceLayout` / `virtualizedTree`，都要造 10 万级节点）默认跳过，`AB_INCLUDE_SLOW=1` 才跑；④每条读数加 `secs` 字段；⑤新增 `rebuild_log.cjs`，分批跑完后从 `results.jsonl` 拼回整份日志 | 整轮 213 从「跑到 188 就被中断」变成可分批稳定完成 | 否 | `ab_full_1008.log` |
| 2026-10-01 | B5-a | **`Link` 把自己的几何同步给主 Shape**（官方 `Link.xN()`/`h3()`：`e.dt = this.dt`，绕过 `Shape.geometry` setter 以免每次算路线都触发重新测量；无条件同步，哪怕 `pointsCount < 2`）；另外 `Shape.geometry` getter 在 `_geometry === null` 且 `part` 是 Link 时按需 `updateRoute()` 一次 | `pathAnimation`（`link.path.geometry.getPointAlongPath`）与 `treeLoadAnimation`（`link.elt(0).geometry.copy()`）双双从报错 → 正常渲染，结构与官方一致（20/24、100/99） | 否 | 定向 |
| 2026-10-01 | B5-b | **删掉 `Diagram.model` setter 里自造的 `'Replace Model'` 事务**。官方 `set model(t)` 只做 `invalidateDocumentBounds()` + 重挂监听者，不走事务；我们那次自造事务让 `"ModelChanged": e => { if (e.isTransactionFinished) … }"` 在 `myDiagram.model = …` 那一刻就响，而此时样例还没执行到 `myDiagram2 = new go.Diagram(...)` → `myDiagram2 is not defined` | `twoDiagrams` **6/6**、`spacingZoom` **4/5**，两个样例同一个根因一起归零 | 否 | 定向 |
| 2026-10-01 | B5-c | **`Panel._measureHorizontal` 按官方 `PanelLayoutHorizontal.measure` 一律用 `width = Infinity` 测量子元素**（以前传 `availW - totalW`，累加超宽后变负数 → `TextBlock` 里 `Math.min(naturalWidth, 负数)` = 负数 → `new Rect(0,0,-18.52,81.05)` 抛错）；`_resolveStretchWidth/Height` 补官方那个 `Math.max(…, 0)` | `regrouping` 报错归零（16/0 与官方一致）、`spreadsheet` 报错归零 | 否 | 定向 |
| 2026-10-01 | B5-d | **ThemeManager 对齐官方**：①`_themes` 从私有 `Record` 改成项目自带 `Map`，并补 `get/set themeMap` + `findTheme`（官方 go.d.ts 有；样例 `themeManager.themeMap.get(currentTheme).colors[x]` 之前拿到 undefined）；②`set(name, props)` 按官方语义：`''` → 默认主题、已存在主题按 colors/fonts/… **浅合并**、返回 this；③补 `changesDivBackground`（**默认 false**，官方 go.js 是 `UP=!1`）+ `Diagram.setDivBackground` | `icons` **99.307% → 1.225%**（主题 `set('', {colors:{div:'#6495ED'}})` + `changesDivBackground=true` 现在正确生效）。中途试过把 `changesDivBackground` 默认设 true，会用主题 `colors.div` 覆盖样例 htmlContent 自带底色，`arrowheads`/`orgChartStatic`/`connectionBoxNode` 的 diff 从 5%/9%/17% 飙到 98%/63%/94% —— 已按官方改回 false | 否 | 定向 |
| 2026-10-01 | B5 全量 | B5-a~d 之后**分 3 批**跑完 213 个 base | `ERR-OURS` 13 → **6**，其中 3 个是 harness 在 10 万级节点样例上的超时（已进 `slow.txt`）→ **真实引擎错误只剩 3 个**（`radialPartition` / `flowgrammer` / `LinkLabelRouter`）；本批修复 7 个（`icons` `pathAnimation` `regrouping` `spacingZoom` `spreadsheet` `treeLoadAnimation` `twoDiagrams`）；**新增错误 0 个**；恒定 5 样例读数逐位不变 | 否 | `ab_full_1009.log` + `classify.md` |
| 2026-10-01 | B6-a | **`LayoutVertex` 补齐官方公开面**（go.d.ts `class LayoutVertex`）：`data`、`focus: Point`、`sourceVertexes`/`destinationVertexes`/`vertexes`/`edges`/`edgesCount`、`deleteSourceEdge`/`deleteDestinationEdge`、`commit()`；`centerX/centerY` 改成官方的 `bounds ± focus` 语义（原来是自己算的 focusX/focusY 分数） | `radialPartition` 的 `v.edges.each(...)` 不再是 undefined → **38.2% → 0.978%** | 否 | 定向 |
| 2026-10-01 | B6-b | **`LayoutNetwork` 补齐官方 API**：`addParts(parts, toplevelonly?, pred?)`、`deleteVertex`、`deleteNode`、`deleteLink`、`findAllParts()`（`ParallelLayout` 紧接着就会调 `net.deleteNode(this.mergeNode)`） | 为 `flowgrammer` 铺路（该样例 diff 14.1% → 12.8%） | 否 | 定向 |
| 2026-10-01 | B6-c | **`Layout.collectParts` 对齐官方**（go.js `collectParts` + 私有 `Ka`）：Diagram 入参分别遍历 `nodes`/`links`/`parts` 三份且**只收 `isTopLevel`**；Group 入参遍历 `memberParts`；过滤条件用 `canLayout()` 而不是 `isLayoutPositioned && visible`；`isLinkLabel` 跳过；`Group` 且 `layout === null` 时**递归收成员**而不是收这个组。额外保留 `visible === false` 过滤（官方的 `diagram.parts` 会把临时层的 part 也带进来） | `regrouping` **31.618% → 3.863%**、`regroupingTreeView` **18.568% → 1.277%**（两个都是分组样例，正是这个改动针对的场景）；平均 diff 10.976 → 10.839。**已知回退**：`shapes` 20.456% → 31.588%（该样例本来就少 32 个节点，`n` 249/281，待单独查） | 部分（shapes 记为待查） | `ab_full_1011.log` |
| 2026-10-01 | B6 全量 | B6-a~c 之后分 3 批跑完 213 个 base | `ERR-OURS` 6 → **5**（3 个 harness 超时 + `flowgrammer` + `LinkLabelRouter`）；**新增引擎错误 0 个**；恒定 5 样例读数逐位不变 | 否 | `ab_full_1011.log` + `classify.md` |
| 2026-10-01 | B7-a | **rollup/terser 打开 `keep_classnames` + `keep_fnames`**（只改构建配置，不动 `src/`）。原因：`classHierarchy` 样例遍历 `for (const k in go)` 拿 `Object.getPrototypeOf(cls).name` 当父类名来建树；terser 默认把类名压成 `e`/`t`/`w`，于是 parent 全变成乱码，**47 条树链接一条都建不出来** | `classHierarchy` **40.535% → 14.931%**（链接 0 → 36）、`Arranging` **36.386% → 21.789%**（链接 0 → 36）；210 个有效样例平均 diff 11.155% → 10.865% | 否 | `ab_full_1012.log` |
| 2026-10-01 | B7 试做（已回退） | 试过在 `Model.nodeDataArray` setter 里按官方做法给缺 key 的条目补唯一 key，想修 `timeline`（11 节点 0 链接）的树链接 | **回退**：会连带改变 `arrowheads` 节点数 41→42、`orgChartStatic` 链接 38→0、`comments` 4.4%→7.0%、`DOMTree` 直接抛 `Model is read-only`（`makeNodeDataKeyUnique` 内部走 `setDataProperty`）。收益不抵代价，已 `git checkout` 撤销，`timeline`/`regroupingTreeView` 的 0 链接留作下一批单独查 | 是（已回退） | — |
| 2026-10-01 | B7 全量 | B7-a 之后分 3 批跑完 213 个 base | `ERR-OURS` 5 → **5**（无新增）；`STRUCT` 13 → 15（两个新条目正是被修复链接的 `Arranging`/`classHierarchy`，从「节点对链接 0」变成有链接）；平均 diff 11.155% → **10.865%**；恒定 5 样例逐位不变 | 否 | `ab_full_1012.log` |
| 2026-10-01 | B8-a | 补齐官方缺的 7 个公开类：`Quadtree`（完整四叉树）、`DraggingInfo`、`DraggingOptions`、`CircularNetwork`/`CircularVertex`/`CircularEdge`、`Themes`（light/dark 逐项对齐官方），`PanelLayout` 补 `static className`；`ForceDirectedNetwork`/`Vertex`/`Edge` 从空壳改成 `LayoutNetwork` 子类 | `scripts/compare-api.cjs` **API ACCEPTANCE PASSED**：85/85 类、60/60 枚举、枚举成员/原型成员/静态成员**全部 0 缺失**；`LinkLabelRouter` 报错归零（6/15 与官方一致） | 否 | `ab_full_1013.log` |
| 2026-10-01 | B8-b | **`Shape.getFigureGenerators()` 不再过滤扩展图形**（官方返回 `G.Mn` 里所有非小写名，含 `extensions/Figures.js` 注册的）；同时从 `src/figures/Figures.ts` 删掉 12 个官方**不存在**的过期图形名（`Annotation` `Bar` `Cross` `End` `Kite` `Note` `OffPageLink` `PredefinedProcess` `Preparation` `Shield` `Star` `ThinArrow`） | 图形注册表与官方**完全一致**（277 = 277，0 缺 0 多）；`shapes` 节点数 **249/281 → 281/281**，该样例的 STRUCT mismatch 消除（diff 31.6% → 38.4%，因为多画出了 32 个此前缺失的节点，剩下的都是图形轮廓本身的像素差异） | 否 | `ab_full_1014.log` |
| 2026-10-01 | B8 全量 | B8-b 之后分 3 批跑完 213 个 base | `ERR-OURS` 7 → **5**，`STRUCT` 13 → **12**（`shapes` 出列），无新增引擎错误；恒定 5 样例逐位不变 | 否 | `ab_full_1014.log` |
| 2026-10-01 | 读数噪声清单 | 反复重跑差异 >3pp 的样例里，有一批是**渲染不稳定**而非真回退 | `radialPartition`（0.97% / 25.9% / 30.4% / 39.5% 四次读数）、`localView`（13.3/14.2/17.1，且官方 `n/l` 自己在 110/108 与 117/115 间跳）、`miningSim`（23.1/28.0/31.5）、`kittenMonitor`（0.7/8.1/8.1）、`sparklineGraphs`、`shapes`（部分受动画时序影响）。判断单点回退前必须**重跑该样例 2 次以上** | — | — |

---

## 5. 执行规则（硬约束）

1. **每批改完必跑**：`npx tsc --noEmit` → `npx rollup -c` → `npm run test:cdp` → 恒定样例 A/B。
2. **指标变差就回退**，回退也记台账（09-30 已有 10 条回退记录，别重复踩）。
3. **集合类一律用项目自带 `List/Map/Set/Iterable`**（`src/core/*`），禁用原生 `Map/Set/Iterator`。
4. **改 `src/**` 后必须重建 dist**，测量脚本加载的是 `dist/open-gojs.umd.js`。
5. **Windows**：不用 `/dev/null`、不用 `ls | head` 之类；日志落 `temp/*.log`。
6. **临时文件一律放 `temp/`**，不放 C 盘。
7. **不提交**（当前 `git status` 223 个文件）；提交需用户明确指示。
8. `examples/` 与官方不一致时，先判定是「本地样例过期」还是「引擎缺陷」——
   **只有引擎缺陷才改 `src/`**，样例代码差异归 `sample-parity-2026-09-30.md` §6 #9。

---

## 6. 完成定义（DoD）

- [ ] 228 个索引条目**全部**有读数，或在 `classify.md` 里显式标注 `NO-COMPARE` 并给原因
- [ ] `classify.md` 的 P0-ERR 桶为空（或每项有已记录的、待办的根因）
- [ ] §3 每个批次状态为「完成」或「已评估并说明为何不做」
- [ ] 全量扫描的报错集合 ≤ P0 基线
- [ ] 恒定样例五项无一上升
- [ ] `sample-parity-2026-09-30.md` §4 指标已刷新为最终读数
