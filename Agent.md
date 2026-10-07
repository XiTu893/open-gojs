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
- 【未决】sequenceDiagram 7.483（官方 3.053）。已 A/B 确认根因=Link.copy 多态化（`new this.constructor()`）。多态时 link 本身正确（MessageLink 覆盖保留、pts 与官方一致），但 **activity/groupposition 错**：groups ab.y=-256 vs 官方 -25，activities 落 group 左上角（ab.y=-256）而非 binding 位置(35/55/75…)。`computeActivityLocation` 返回值异常（act-7 应 [0,75] 实际 [-37.79,-256.07]，≈group ab 左上+5.5）。用 base `new Link()` copy 则 nodes 全对、diff 3.05。疑 group 'Vertical' layout 在活动 binding 未生效时把 NaN-position 成员网格叠放；binding 空 sourceProperty 处理正确（Binding.ts:91）。待查：为何多态 copy 会改变 activity 绑定时序/结果。