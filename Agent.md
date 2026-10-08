本项目目标是复刻gojs。
vitest 测试很慢，建议换一种测试方法，尽量使用cdp操作浏览器方法实现canvas渲染对比

测试临时性文件请放到本项目temp文件夹下，不要放C盘
对标官方gojs已编译打包的代码、api文档，learn文档，完全复刻一个open-gojs,代码全部在src下。

然后使用examples下的样例逐个对标验证有消息。确保渲染和交互功能一致。

对标官方gojs已编译打包的代码、api文档，learn文档，完全复刻一个open-gojs,代码全部在src下。
，分析examples下样例，从简单到复杂，逐一比较，并验证修复。请先拟定计划，再按步骤修正。

## 会话状态（截至 2026-10-07）
- 已提交 56e4648：Link 几何修复 —— 官方 `_computeRouteBounds`(nT) 曲线盒、makeGeometry 官方分支、commitRoute 先 invalidateGeometry、_syncGeometryToMainShapes 路由有效守卫、set points=finalize+invalidateGeometry+raiseChanged、_measureArrangeAll 渲染期对几何失效 link 补测。
  - 结果：multiNodePathLinks 1.877→0.626；grafcet L17/L21 陈旧几何修复（gb 宽 0→24，documentBounds 与官方 bitwise 一致，db 已 match）；无回归。grafcet 像素仍 6.322（残余为 0.0005px 字体测量偏差 + L21 箭头 0.5px）。
- 官方几何字段：`dt`(几何)、`rn`、`Xa`(Mt&128, isGeometryValid)、`Zi`(Mt&16, isRouteValid)、`fi()`=Link.invalidateGeometry 主体（Xa&&(Xa=!1,f())）、`Dk()`=finalizeRoute（Zi=true+nT+lc 清+defaults+Fk(!1)）、`xN()`=sync、`h3()`；`commitRoute=fi,Dk,t("points")`；`set points=i.b(),Ae=i,fi(),Dk(),yb.add,t("points")`。
- ✅【已解决】sequenceDiagram 7.483 → **1.708**（已提交 c145617）。**真根因 = `Part._resolveLocationObject`**：官方 `locationObject` 对 **任何 Part** 都先查 `locationObjectName`，仅当无 name 时 Group/Adornment 才用 placeholder；我们旧代码对 Group 无条件返回 placeholder → sequenceDiagram 的 group `locationObjectName:'HEADER'` 被 placeholder(高度=成员区)顶掉，locationOffset 按占位符算 → group position.y 整体上移 231px（ab.y -256 vs 官方 -25）。修后 group 回 -25、活动在绑定位置(35/55/75)、链接接上 lifeline。**不是** Link.copy 多态/时序、也不是 binding 空串源。多态 copy 只是改变错误态出现的早晚（ab_render 2s vs probe 3s 捕获差造成此前假象）。
- 附带发现（未改，属独立小 bug）：`GraphObject.bindTwoWay` 用 `sourceProperty||targetProperty`（607 行）把显式空串源 `''` 吞成 targetProperty（官方用 `e===void 0?e=t:e` 区分）→ `bindTwoWay('location','',conv)` 的 converter 读 `data['location']`(undefined) 被跳过。修它会令活动 binding 生效，但 sequenceDiagram 已由 locationObject 修复覆盖，先不动避免影响其他样例。
## 会话状态（截至 2026-10-08）
- 已提交 **f602c36**（Align mouse interaction and undo history with official GoJS，含 dist）：
  - **指针事件**：官方 `Diagram.IO()` 只挂 `pointerdown/move/up/out/cancel/enter/leave + wheel/key/blur/focus/selectstart/contextmenu`。实测同一坐标 `pointermove.clientX=182.9106903`（浮点）而 `mousemove.clientX=182`（截断）—— 用 mouse 事件算 viewPoint 恒偏 ~0.8px，是探针 `fi`/`li` 全量偏移的根因。`_setupMouseEvents` 已改指针事件，拖拽期挂 document 捕获监听。
  - `pointerout/pointerleave` 官方 `kd(t,true)` 会**用离开边界的原生事件重算** viewPoint/documentPoint 落到 lastInput（探针 `li.clickBg` 的 `[-18.9,-25.7]` 正是光标轨迹与画布左边界交点 clientX=72.89）。
  - 滚轮后重算 `lastInput.documentPoint` + `standardMouseOver()`（官方滚轮 li.doc 是**滚动后**值，且 cursor 会重算）。
  - `transformDocToView/transformViewToDoc` **删掉 padding**（官方只 translate(-position)+scale）；`Diagram.findObjectAt` 改为逐层 `Layer.findObjectAt`（文档坐标、含 temporary 层）。
  - **UndoManager 打通**：`Diagram._raiseChangedEvent` → `model.undoManager.handleChanged`（官方 `Diagram.iC`）+ `UndoManager.handleChanged` 应用 `skipsEvent`；`GraphObject.position`/`Part.location` setter 补 `raiseChanged('position'/'location')`；`_runLayoutInTransaction`（官方 `Diagram.J2`）与 `Layout.updateParts` 包 "Layout" 事务；DraggingTool `transactionResult='Move'`。
  - `Part._copyPartPropertiesTo` 补 `_selectionAdorned`/`_selectionAdornmentTemplate`（样例 `selectionAdorned:false` 不再被 copy 丢掉）。
  - `DraggingTool` 拖拽写 `part.move(newLoc, true)`（官方 moveParts 一律写 location）。
- **probe_interact flowchart 现状**：`fi / li / cursor / canUndo / tool / level / adornments / nodeLoc*` **全部 match**。仅剩诊断字段差异：`dbounds`（点选后官方 documentBounds +1）、`umHist/umCount/umHistNames`（官方 idle 时 history=0、Layout 事务在 click 时才提交且只含 `position:Node + 4×points`；我方 load 时提交且含 48×points）。
- **全量回归**：`ab_full_1033.log` vs `ab_full_1032.log` → paired=205 **mean 5.707 → 5.691（全量 207 样本 5.831 → 5.693）**；improved 5（containerShipping 7.38→3.64 未解释回归已消失、productionLine3D 11.61→8.37、adornmentButtons、instrumentGauge、LinkLabelRouter），regressed 12（waferMap +1.59、dynamicPorts +0.63、SectorReshaping +0.44、AvoidsLinksRouter +0.40、orgChartStatic +0.35、controlGauges +0.33…）。
- 仍待办：① 官方 Layout 事务的**时机与内容**（为何 idle=0、click 时才提交；为何只有 1 个 Node position + 4 个 points 而我方 48 个 points）；② `dbounds` 点选后 +1（我方不变）；③ 12 个回归样例（waferMap/dynamicPorts/SectorReshaping/AvoidsLinksRouter…）；④ `addEventListener/removeEventListener` 空壳、`showContextMenu` 崩溃、空格平移；⑤ LayeredDigraph 旧残差（PERT/sankey/genogram）与 `probe_parts.cjs` 官方 parts 0 条的脚本 bug。
- 探针用法：`node temp/survey/probe_interact.cjs <base>`（`IX_FULL=1` 全快照）；`temp/survey/probe_interact.cjs` 已内置 `lastEv/evs/pos/dbounds/fiNative` 诊断，`fiNative`/`evs`/`lastEv` 已从 diff 中排除。全量：`node temp/survey/ab_render.cjs $(awk '{print $1}' temp/survey/ab_full_1032.log) --all > ab_full_1033.log`；对比 `node temp/survey/cmp_logs.cjs ab_full_1033.log ab_full_1032.log`（**输出 `old -> new`，improved/regressed 标签是准的**；但必须用相对 temp/survey 的文件名，脚本按该目录 resolve）。
