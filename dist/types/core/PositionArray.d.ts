import { Rect } from './Rect';
import { Size } from './Size';
/**
 * PositionArray - 官方避障网格图（go-debug `class PositionArray`，799249 起）。
 *
 * 每个单元格是 Uint32Array：
 * - `mn = 0`：障碍占用；
 * - `Sc = 1` .. `kg = 999999`：到障碍的 BFS 距离（tR/Lo/GS/qS 写入）；
 * - `yA = kg+1`：网格外或未计算；
 * - `wA = kg+2`：iR 路径搜索的临时访问标记。
 *
 * `Ob(rect)` 重设覆盖范围并全部填 yA；`fE` 标记占用；`tR(from,fromDir,to,toDir,bounds,usePath)`
 * 从两个端口方向做距离场（GS/qS 沿方向射线标距，iR 尝试直接路径，否则 Lo 递推扩散），
 * AvoidsNodesRouter.rV/hT 再沿距离场回溯出绕开障碍的折线。
 */
export declare class PositionArray {
    /** 单元格被占用 */
    static readonly mn: number;
    /** 最小距离 */
    static readonly Sc: number;
    /** 距离上限 / 未知上限 */
    static readonly kg: number;
    /** 网格外或未计算 */
    static readonly yA: number;
    /** 搜索访问标记 */
    static readonly wA: number;
    private _minX;
    private _minY;
    private _maxX;
    private _maxY;
    private _cellWidth;
    private _cellHeight;
    private _grid;
    private _maxCol;
    private _maxRow;
    /** 官方 qa：最近一次构建所用的容器（Group/坐标系） */
    container: any;
    /** 官方 gC：最近一次构建的 ignore 节点 */
    ignore: any;
    /** 官方 Qo：需要重建（占用变化后置 true） */
    needsRebuild: boolean;
    /** 官方 pw：tR 判定两端几乎同格 */
    tooClose: boolean;
    /** 官方 Nf：默认 Link.JF（11），rV 端部膨胀用 */
    Nf: number;
    /** 官方 mC：水平方向距离场回退膨胀格数 */
    mC: number;
    /** 官方 pC：垂直方向距离场回退膨胀格数 */
    pC: number;
    constructor(cellSize: Size, nf?: number);
    /** 官方 `Ob(rect)`：把覆盖范围扩到 rect（外扩一格），重建网格并全部填 yA */
    Ob(rect: Rect): void;
    get bounds(): Rect;
    get cellWidth(): number;
    set cellWidth(val: number);
    get cellHeight(): number;
    set cellHeight(val: number);
    /** 官方 `Pg(x,y)`：点是否在网格覆盖内 */
    Pg(x: number, y: number): boolean;
    /** 官方 `To(x,y)`：点所在单元格的值 */
    To(x: number, y: number): number;
    /** 官方 `fE(x,y,w,h)`：把矩形覆盖的单元格标为占用 */
    fE(x: number, y: number, w: number, h: number): void;
    private _fill;
    /** 官方 `aD()`：把距离值（>=Sc）重置为 yA，保留占用（mn）——每次路由前清距离场 */
    aD(): void;
    /** 官方 `S4(x,y)`：点所在格是否被占用 */
    S4(x: number, y: number): boolean;
    /** 官方 `isUnoccupied(x,y,w,h)`：矩形范围内没有任何占用格 */
    isUnoccupied(x: number, y: number, w: number, h: number): boolean;
    /** 官方 `maxAvoidsLinksSpaceH(x0,x1,y,h)`：水平方向上下扫描可用避让空间 */
    maxAvoidsLinksSpaceH(x0: number, x1: number, y: number, h: number): number;
    /** 官方 `maxAvoidsLinksSpaceV(y0,y1,x,w)`：垂直方向左右扫描可用避让空间 */
    maxAvoidsLinksSpaceV(y0: number, y1: number, x: number, w: number): number;
    /** 官方 `k4(t,i,e,s,n,o,r,l)`：从 (c,r) 沿 dir 直线写递增距离，遇 >=h 的值或越界停；返回停位 */
    private _k4;
    /** 官方 `Lo`：从 (c,r) 起沿 dir 直线写距离后，向两侧垂直递归扩散 */
    Lo(c: number, r: number, dir: number, horizontal: boolean, minC: number, maxC: number, minR: number, maxR: number): void;
    /**
     * 官方 `GS`：从 (c,r) 沿 (horizontal? step=±1 方向) 直线逐格 +1 写距离（起点先写 Sc），
     * 遇占用(mn)或越界停；返回停时的行/列坐标。
     * `n` = 非水平方向时的步进；`o` = 是否水平；`r/l/h/a` = 边界。
     */
    private _GS;
    /**
     * 官方 `qS(t,i,e,s,n,o,...)`：**从 (e,s)（目标端格）**沿 toDir 方向写 kg 常量线
     * （目标端“吸入”标记，Lo 抵达时会用真实距离覆盖；rV 用 To(目标) 读 kg 判断可达性）。
     * 前两参 t,i 官方保留未用。
     */
    private _qS;
    /**
     * 官方 `tR(fromPt, fromDir, toPt, toDir, bounds, usePath)`：
     * 从两端端口按方向做距离场。from 端用 GS 递增写距，to 端用 qS 写 kg 吸入线；
     * usePath=true 时先试 iR 直接路径（写成 Sc.. 的递增序列），失败则 Lo 四向扩散。
     * 两端格距 <=1 时置 tooClose 并直接返回。
     */
    tR(fromPt: PointLike, fromDir: number, toPt: PointLike, toDir: number, bounds: Rect, usePath: boolean): void;
    /**
     * 官方 `iR`：从 to 端格沿 toDir 逼近 from 端格，途遇分叉则转 90° 递归；
     * 成功时 `out` 为交替 (c,r) 路径点列，失败回溯清空（保留调用方 push 的内容语义）。
     * 途中把走过的格标成 wA 防止重入。
     */
    private _iR;
}
interface PointLike {
    x: number;
    y: number;
}
export {};
