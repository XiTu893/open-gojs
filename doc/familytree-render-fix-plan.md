# open-gojs 修正计划：familyTree.html 渲染

本计划记录 familyTree.html（及同类树/图片样例）渲染问题的根因与分步修正方案，
供持续迭代开发 open-gojs 时参考。目标是：**树结构正确、节点不重叠、初始视图缩放定位正确、`go.Picture` 图片正常显示**。

## 0. 背景与预期（对照官方 GoJS 样例）

官方 `familyTree.html`（https://gojs.net/latest/samples/familyTree.html）的预期行为：

- 使用 `go.TreeLayout({ angle: 90, ... })`，树从根 "King George V" 向下生长（深度沿 Y，兄弟沿 X 铺开）。
- 节点模板含 `go.Picture`（国王/王子/平民 SVG 头像）、姓名、生卒年份徽章、子女人数圆形计数。
- 初始化时在 `InitialLayoutCompleted` 事件里设 `diagram.scale = 0.6` 并 `scrollToRect(root.actualBounds)`，
  使首屏聚焦到根节点并缩放，而非停在文档 (0,0) 左上角。
- 每层节点按 `layerSpacing` 分隔，兄弟按 `nodeSpacing` 分隔，层间不重叠。

## 1. 已确认的根因与修复（已完成）

### 1.1 TreeModel 添加节点后未生成父子链接
- 现象：所有节点堆叠在 (0,0)，因为模型没有 link → 布局视为全是根。
- 根因：`_onModelChanged` 的 `nodeDataArray` 插入分支只 `_addNodeForData`，从未为 TreeModel 的
  `parent` 关系创建 link。
- 修复：插入节点时若 `_model instanceof TreeModel`，调用 `_addLinkForTreeData(data, parentKey)`。
- 链接存储：仿官方，为每条父子关系生成独立 linkData `{ from, to }`，以 linkData 为 key 存入 `_parts`，
  避免与节点 data 冲突（不新增 `_treeLinkMap`）。用 `_treeLinkDataByChildKey` 记录 childKey→linkData 便于删除。

### 1.2 模型变更后布局不重跑（`isOngoing` 门控 bug）
- 现象：布局只跑一次（空树时），加节点后不再布局。
- 根因：`_onModelChanged` 末尾 `if (needsLayout && layout.isOngoing) invalidateLayout()`；
  `isOngoing` 恒为 true，但更关键的是加节点后未设置 `_layoutInvalid` / `requestUpdate`。
- 修复：改为 `if (needsLayout) { this._layoutInvalid = true; this.requestUpdate(); }`。

### 1.3 动画回退触发无限重排（`isOngoing` 未随布局生命周期开合）
- 现象：`_performLayout` 里动画把 `node.location` 设回旧值，而 `Part.location` setter 在
  `layout.isOngoing` 为 true 时调用 `invalidateLayout()`，导致每帧无限重排、位置不稳。
- 修复：在 `_performLayout` 里 `doLayout` 前后包裹 `isOngoing = true` / `isOngoing = false`；
  动画回退（`node.location = oldLoc`）发生在 `isOngoing=false` 之后，不再触发重排。
- 同时：`oldPositions` 只捕获 location 为合法数值的节点，避免把新节点回退到 NaN。

### 1.4 TreeLayout 构造器不应用 init 选项
- 现象：`new go.TreeLayout({ angle: 90, ... })` 的选项被忽略（angle 恒为 0）。
- 根因：`TreeLayout.constructor()` 不接受 `init` 参数。
- 修复：`constructor(init?: Partial<TreeLayout>)`，在设置默认值后逐项应用 `angle`、
  `nodeSpacing`、`layerSpacing`、`treeStyle`、`layerStyle`、`compaction`、`sorting`、`path`、
  `arrangement` 及 `alternate*` 系列。角度语义：0/180=横向、90/270=纵向（depth 沿 Y）。

### 1.5 布局未测量节点，导致层/兄弟宽度错误重叠
- 现象：节点使用未测量的极小宽度，同层兄弟横向重叠。
- 根因：`makeNetwork` 里 `getLayoutBounds` 返回未测量（约为 0）的 actualBounds。
- 修复：`makeNetwork` 对每个 Node 先 `_measure(Infinity, Infinity)`，当 `measuredBounds` 有实尺寸时
  以 measuredBounds 的宽高作为 vertex 尺寸。

### 1.6 层间纵向重叠（layerSpacing 未叠加节点高度）
- 现象：层仅按 `layerSpacing` 间距摆放，节点高 110 > spacing 50，上下层重叠。
- 根因：`_positionTree` 用 `node.layer * layerSpacing` 定深度，未考虑节点高度。
- 修复：`doLayout` 先算每层最大节点尺寸，`layerOffsets[i] = layerOffsets[i-1] + maxLayerSize + layerSpacing`，
  `_positionTree` 用 `layerOffsets[node.layer]` 定深度。

### 1.7 空字符串绑定语义错误（阻断所有节点渲染）
- 现象：`bind('text', '', ({born,death}) => ...)` 抛
  "Cannot destructure property 'born' of 'undefined'"，所有节点构建中断，页面只显示根。
- 根因（两处）：
  1. `Binding` 构造器 `sourceProperty = sourceProperty || targetProperty` 把空串 `''` 误当作未传，
     变成长 targetProperty；官方 GoJS 中 `''` 表示**绑定整个 data 对象**。
  2. `Binding.getValueFromSource` 对 `''` 返回 `data['']`=undefined。
- 修复：
  - `Binding` 构造器：`sourceProperty !== undefined ? sourceProperty : targetProperty`，保留 `''`。
  - `getValueFromSource`：`sourceProperty === ''` 时 `value = data`（整个 data 对象）。
  - `Diagram._resolveBindingValue` 的 `sourceObject !== null`（`bindObject`）分支同理：
    `sourceProperty === ''` 时 `val = sourceObj`（Part 本身），否则 `sourceObj[sourceProperty]`。

## 2. 待解决问题与修正步骤

### 2.1 `go.Picture` 图片不显示
- 现象：节点上的 SVG 头像（`pictureStyle` 绑定 `source` / `desiredSize`）未显示。
- 可能根因（待查）：
  - `go.Picture` 的 `source` 加载 SVG 的机制（DOM Image / canvas 绘制）未实现或未触发重绘。
  - `Picture._measure` / 实际绘制（CanvasRenderer 处理 Picture）缺失。
  - SVG 相对路径在 file:// 下加载失败（CONSOLE ERR: ERR_FILE_NOT_FOUND）。
- 修正步骤：
  1. 检查 `src/view/Picture.ts` 的 `_measure`、`source` setter、图像加载回调。
  2. 检查 `src/render/CanvasRenderer.ts` 是否绘制 Picture（drawImage）。
  3. 在真实页面中用本地图片/绝对路径验证，排除路径问题。
  4. 若 Picture 未实现加载，补上图像异步加载 + 渲染重绘。

### 2.2 初始视图缩放/定位未生效（真实页面）
- 现象：diag 复现时 `scale=0.6`、`scrollToRect` 均生效，但真实 familyTree 打开仍只看到根或停在左上角。
- 可能根因（待查）：
  - `go.Diagram.fromDiv` 或 diag 获取 diagram 方式不准（`no diagram`），需先核实真实渲染状态。
  - `_renderLoop` 里 `_applyInitialViewport` 后未再触发一次渲染，`scale/position` 变更未绘制。
  - `viewSize`（div 尺寸）在首次布局时为 0，导致 viewport 计算异常。
- 修正步骤：
  1. 修正 diag：通过 `document.getElementById('myDiagramDiv')._goDiagram` 获取 diagram，
     统计真实节点数 / scale / position / 截图。
  2. 确认 `InitialLayoutCompleted` 监听器是否在**空树**时过早触发（`_hasPerformedInitialLayout` 时序）。
  3. 若 `scale/position` setter 未触发重绘，补齐 `requestUpdate`。

### 2.3 布局高级特性（LastParents / BottomRightBus 紧凑排列）
- 现象：目前树已正确铺开，但未实现 `treeStyle=LastParents` + `alternateAlignment=BottomRightBus`
  的"末层父节点子节点总线式紧凑"布局。
- 说明：这是**视觉优化**，不影响正确性。家族树样例已可用；可作为后续增强项。
- 修正步骤（可选）：在 `TreeVertex` 上落实 `treeStyle`/`alternateAlignment`/`alternateCompaction`，
  对末层父节点做子节点向父节点总线收拢。

## 3. 验证方式

- 用 `temp/realdiag.cjs` 加载真实 `examples/familyTree.html`：
  - 无 PAGEERROR（绑定异常已清零）。
  - 节点数 = 95、链接数 = 94。
  - `scale` 约 0.6，viewport 定位到根节点。
  - 截图确认树从上到下生长、节点含图片、层间无重叠。
- 用 `npm run typecheck` 保证无类型错误。
- 回归：`npm test` 跑已有单元测试，确认未破坏其他布局/模型功能。

## 4. 备注

- 绑定相关改动集中在 `src/model/Binding.ts` 与 `src/diagram/Diagram.ts` 的
  `_resolveBindingValue` / `_applyBindingsToObject`。
- 布局相关改动集中在 `src/layout/TreeLayout.ts`、`src/layout/Layout.ts`、
  `src/diagram/Diagram.ts` 的 `_performLayout` / `_onModelChanged` / `_addLinkForTreeData`。
- 所有改动应避免新增 `any`，尽量用明确类型（`ObjectData`、`Rect`、`number[]` 等），与官方 API 对齐。