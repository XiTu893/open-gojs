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
  - 活动 binding `bindTwoWay('location','',computeActivityLocation,…)` 因 GraphObject.bindTwoWay 用 `sourceProperty||targetProperty`（607 行）把空串源吞成 'location' → 读 `data['location']`(undefined) → converter 跳过 → 活动 location 保持 NaN。**这在 base 与多态两变体下完全一样**（hook 均 src=location→undef），**不是分水岭**。修 bindTwoWay 反而两变体都变差（poly 7.87/base 7.77）。
  - 实测渲染差异：base vs poly 像素差 6.52%，集中在顶部 band（row 5-142，group/lifeline 区，maxrow 352）+ 均匀薄带（row 144-327，消息链接）。**根因=group 垂直位置高 231px**（ab.y=-256 vs 官方 -25）。
  - **本轮新结论**：ab_render 捕获在 2000ms，probe 在 3000ms。**base 在 2s 画对(3.05)，但 3s 也 settle 到 group -256**；poly 在 2s 已画错。即 **group -256 是所有变体最终都到的错误态**，base 只是碰巧在 2s 画对。**真正的 bug=group 'Vertical' panel 把 lifeline 放到 header 上方**（group 内容高 = header~25 + lifeline230 = 256，ab.y=-256 → 整个内容在 location.y=0 之上）。这与 Link.copy 无关（group 模板两变体相同）——多态 copy 只是改变错误态出现的早晚。
  - 修 binding（sourceProperty=''，活动位置正确 [100,35]）**不修 group**（group 仍 -256），且 diff 反变差(7.87)。
  - 结论：剩余序列根因 = **group 'Vertical' panel 元素排列错**（lifeline 应在 header 下方、实际在上方），与多态 copy 只是时序耦合。binding 空串源是独立小 bug（官方 `e===void 0?e=t:e`），暂不改（会伤本样例）。**下一步建议**：查 group 'Vertical' panel 对 HEADER(Auto) + LineV lifeline 两元素的排列——为何 lifeline 被放到 header 上方（面板测量/锚点/height 绑定时机）。