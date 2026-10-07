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
- 【未决】sequenceDiagram 7.483（官方 3.053；base `new Link()` copy=3.053）。A/B 确认根因=Link.copy 多态化。**深挖后的精确事实**：
  - 活动 binding `bindTwoWay('location','',computeActivityLocation,…)` 因 GraphObject.bindTwoWay 用 `sourceProperty||targetProperty`（607 行）把空串源吞成 'location' → 读 `data['location']`(undefined) → converter 跳过 → 活动 location 保持 NaN。**但这在 base 与多态两变体下完全一样**（hook 均 src=location→undef），**不是分水岭**。修 bindTwoWay 反而两变体都变差（poly 7.87/base 7.77）。
  - probe 的 actualBounds 在两变体都显示 group-origin（×误导），但 RENDER 不同（base 3.05 正确、poly 7.48 错）。真正差异在**最终渲染态的节点位置**，由 MessageLink 子类 copy 影响**布局/渲染时序**所致。
  - 结论：剩余序列根因=多态 copy 使 MessageLink 触发不同的布局/渲染排程，最终节点画错。binding 空串源是独立小 bug（官方用 `e===void 0?e=t:e` 区分 undefined/空串），暂不改（会伤本样例）。待查：为何多态 copy 改变最终渲染节点位置。