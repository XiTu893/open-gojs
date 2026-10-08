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