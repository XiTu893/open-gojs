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
export class PositionArray {
  /** 单元格被占用 */
  static readonly mn: number = 0;
  /** 最小距离 */
  static readonly Sc: number = 1;
  /** 距离上限 / 未知上限 */
  static readonly kg: number = 999999;
  /** 网格外或未计算 */
  static readonly yA: number = PositionArray.kg + 1;
  /** 搜索访问标记 */
  static readonly wA: number = PositionArray.kg + 2;

  private _minX: number = 1;
  private _minY: number = 1;
  private _maxX: number = -1;
  private _maxY: number = -1;
  private _cellWidth: number;
  private _cellHeight: number;
  private _grid: Uint32Array[] = [];
  private _maxCol: number = 0;
  private _maxRow: number = 0;

  /** 官方 qa：最近一次构建所用的容器（Group/坐标系） */
  container: any = null;
  /** 官方 gC：最近一次构建的 ignore 节点 */
  ignore: any = null;
  /** 官方 Qo：需要重建（占用变化后置 true） */
  needsRebuild: boolean = true;
  /** 官方 pw：tR 判定两端几乎同格 */
  tooClose: boolean = false;
  /** 官方 Nf：默认 Link.JF（11），rV 端部膨胀用 */
  Nf: number;
  /** 官方 mC：水平方向距离场回退膨胀格数 */
  mC: number;
  /** 官方 pC：垂直方向距离场回退膨胀格数 */
  pC: number;

  constructor(cellSize: Size, nf: number = 11) {
    this.container = null;
    this.ignore = null;
    this.needsRebuild = true;
    this.tooClose = false;
    this._cellWidth = cellSize.width;
    this._cellHeight = cellSize.height;
    this._grid = [];
    this._maxCol = 0;
    this._maxRow = 0;
    this.Nf = nf;
    this.mC = this.Nf * 2;
    this.pC = this.Nf * 2;
  }

  /** 官方 `Ob(rect)`：把覆盖范围扩到 rect（外扩一格），重建网格并全部填 yA */
  Ob(rect: Rect): void {
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = rect.x;
    const y = rect.y;
    const r = rect.x + rect.width;
    const b = rect.y + rect.height;
    this._minX = Math.floor((x - this._cellWidth) / this._cellWidth) * this._cellWidth;
    this._minY = Math.floor((y - this._cellHeight) / this._cellHeight) * this._cellHeight;
    this._maxX = Math.ceil((r + 2 * this._cellWidth) / this._cellWidth) * this._cellWidth;
    this._maxY = Math.ceil((b + 2 * this._cellHeight) / this._cellHeight) * this._cellHeight;
    const cols = 1 + (Math.ceil((this._maxX - this._minX) / this._cellWidth) | 0);
    const rows = 1 + (Math.ceil((this._maxY - this._minY) / this._cellHeight) | 0);
    if (this._grid.length === 0 || this._maxCol < cols - 1 || this._maxRow < rows - 1) {
      const g: Uint32Array[] = [];
      for (let c = 0; c <= cols; c++) g[c] = new Uint32Array(rows);
      this._grid = g;
      this._maxCol = cols - 1;
      this._maxRow = rows - 1;
    }
    this._fill(PositionArray.yA);
  }

  get bounds(): Rect {
    return new Rect(this._minX, this._minY, this._maxX - this._minX, this._maxY - this._minY);
  }

  get cellWidth(): number { return this._cellWidth; }
  set cellWidth(val: number) {
    if (val > 0 && val !== this._cellWidth) {
      this._cellWidth = val;
      this.Ob(this.bounds);
    }
  }

  get cellHeight(): number { return this._cellHeight; }
  set cellHeight(val: number) {
    if (val > 0 && val !== this._cellHeight) {
      this._cellHeight = val;
      this.Ob(this.bounds);
    }
  }

  /** 官方 `Pg(x,y)`：点是否在网格覆盖内 */
  Pg(x: number, y: number): boolean {
    return this._minX <= x && x <= this._maxX && this._minY <= y && y <= this._maxY;
  }

  /** 官方 `To(x,y)`：点所在单元格的值 */
  To(x: number, y: number): number {
    if (!this.Pg(x, y)) return PositionArray.yA;
    const c = ((x - this._minX) / this._cellWidth) | 0;
    const r = ((y - this._minY) / this._cellHeight) | 0;
    return this._grid[c][r];
  }

  /** 官方 `fE(x,y,w,h)`：把矩形覆盖的单元格标为占用 */
  fE(x: number, y: number, w: number, h: number): void {
    if (!this.Pg(x, y)) return;
    const c0 = ((x - this._minX) / this._cellWidth) | 0;
    const r0 = ((y - this._minY) / this._cellHeight) | 0;
    const c1 = ((x + w - this._minX) / this._cellWidth) | 0;
    const r1 = ((y + h - this._minY) / this._cellHeight) | 0;
    const cEnd = Math.min(c1, this._maxCol);
    const rEnd = Math.min(r1, this._maxRow);
    for (let c = c0; c <= cEnd; c++) {
      const col = this._grid[c];
      if (col.fill) col.fill(PositionArray.mn, r0, rEnd + 1);
      else for (let r = r0; r <= rEnd; r++) col[r] = PositionArray.mn;
    }
  }

  private _fill(v: number): void {
    for (let c = 0; c <= this._maxCol; c++) {
      const col = this._grid[c];
      if (col.fill) col.fill(v);
      else for (let r = 0; r <= this._maxRow; r++) col[r] = v;
    }
  }

  /** 官方 `aD()`：把距离值（>=Sc）重置为 yA，保留占用（mn）——每次路由前清距离场 */
  aD(): void {
    for (let c = 0; c <= this._maxCol; c++) {
      const col = this._grid[c];
      for (let r = 0; r <= this._maxRow; r++) {
        if (col[r] >= PositionArray.Sc) col[r] = PositionArray.yA;
      }
    }
  }

  /** 官方 `S4(x,y)`：点所在格是否被占用 */
  S4(x: number, y: number): boolean {
    return this.To(x, y) === PositionArray.mn;
  }

  /** 官方 `isUnoccupied(x,y,w,h)`：矩形范围内没有任何占用格 */
  isUnoccupied(x: number, y: number, w: number, h: number): boolean {
    if (x > this._maxX || x + w < this._minX || y > this._maxY || y + h < this._minY) return true;
    let c0 = ((x - this._minX) / this._cellWidth) | 0;
    let r0 = ((y - this._minY) / this._cellHeight) | 0;
    let cols = (Math.max(0, w) / this._cellWidth + 1) | 0;
    let rows = (Math.max(0, h) / this._cellHeight + 1) | 0;
    if (c0 < 0) { cols += c0; c0 = 0; }
    if (r0 < 0) { rows += r0; r0 = 0; }
    if (cols < 0 || rows < 0) return true;
    const cEnd = Math.min(c0 + cols - 1, this._maxCol) | 0;
    const rEnd = Math.min(r0 + rows - 1, this._maxRow) | 0;
    for (let c = c0; c <= cEnd; c++) {
      const col = this._grid[c];
      for (let r = r0; r <= rEnd; r++) {
        if (col[r] === PositionArray.mn) return false;
      }
    }
    return true;
  }

  /** 官方 `maxAvoidsLinksSpaceH(x0,x1,y,h)`：水平方向上下扫描可用避让空间 */
  maxAvoidsLinksSpaceH(x0: number, x1: number, y: number, h: number): number {
    if (x0 > this._maxX || x1 < this._minX || y > this._maxY || y < this._minY) return 0;
    const c0 = ((x0 - this._minX) / this._cellWidth) | 0;
    const c1 = ((x1 - this._minX) / this._cellWidth) | 0;
    const r = ((y - this._minY) / this._cellHeight) | 0;
    const half = (h / this._cellHeight + 1) | 0;
    for (let k = 0; k < half / 2; k++) {
      let hit = false;
      for (let c = c0; c <= c1; c++) {
        if (this._grid[c][r + k] === PositionArray.mn || this._grid[c][r - k] === PositionArray.mn) {
          hit = true;
          break;
        }
      }
      if (hit) return Math.max(0, (2 * k - 1) * this._cellHeight);
    }
    return h;
  }

  /** 官方 `maxAvoidsLinksSpaceV(y0,y1,x,w)`：垂直方向左右扫描可用避让空间 */
  maxAvoidsLinksSpaceV(y0: number, y1: number, x: number, w: number): number {
    if (y0 > this._maxY || y1 < this._minY || x > this._maxX || x < this._minX) return 0;
    const r0 = ((y0 - this._minY) / this._cellHeight) | 0;
    const r1 = ((y1 - this._minY) / this._cellHeight) | 0;
    const c = ((x - this._minX) / this._cellWidth) | 0;
    const half = (w / this._cellWidth + 1) | 0;
    for (let k = 0; k < half / 2; k++) {
      let hit = false;
      for (let r = r0; r <= r1; r++) {
        if (this._grid[c + k][r] === PositionArray.mn || this._grid[c - k][r] === PositionArray.mn) {
          hit = true;
          break;
        }
      }
      if (hit) return Math.max(0, (2 * k - 1) * this._cellWidth);
    }
    return w;
  }

  /** 官方 `k4(t,i,e,s,n,o,r,l)`：从 (c,r) 沿 dir 直线写递增距离，遇 >=h 的值或越界停；返回停位 */
  private _k4(c: number, r: number, dir: number, horizontal: boolean, minC: number, maxC: number, minR: number, maxR: number): number {
    c = c | 0;
    r = r | 0;
    let v = this._grid[c][r];
    if (v >= PositionArray.Sc && v < PositionArray.kg) {
      if (horizontal) r += dir;
      else c += dir;
      v += 1;
      for (; minC <= c && c <= maxC && minR <= r && r <= maxR;) {
        const cur = this._grid[c][r];
        if (v >= cur) break;
        this._grid[c][r] = v;
        v += 1;
        if (horizontal) r += dir;
        else c += dir;
      }
    }
    return horizontal ? r : c;
  }

  /** 官方 `Lo`：从 (c,r) 起沿 dir 直线写距离后，向两侧垂直递归扩散 */
  Lo(c: number, r: number, dir: number, horizontal: boolean, minC: number, maxC: number, minR: number, maxR: number): void {
    if (c < minC || c > maxC || r < minR || r > maxR) return;
    const h = this._k4(c, r, dir, horizontal, minC, maxC, minR, maxR);
    if (horizontal) {
      if (dir > 0) {
        for (let a = r + dir; a < h; a++) {
          this.Lo(c, a, 1, !horizontal, minC, maxC, minR, maxR);
          this.Lo(c, a, -1, !horizontal, minC, maxC, minR, maxR);
        }
      } else {
        for (let a = r + dir; a > h; a--) {
          this.Lo(c, a, 1, !horizontal, minC, maxC, minR, maxR);
          this.Lo(c, a, -1, !horizontal, minC, maxC, minR, maxR);
        }
      }
    } else {
      if (dir > 0) {
        for (let a = c + dir; a < h; a++) {
          this.Lo(a, r, 1, !horizontal, minC, maxC, minR, maxR);
          this.Lo(a, r, -1, !horizontal, minC, maxC, minR, maxR);
        }
      } else {
        for (let a = c + dir; a > h; a--) {
          this.Lo(a, r, 1, !horizontal, minC, maxC, minR, maxR);
          this.Lo(a, r, -1, !horizontal, minC, maxC, minR, maxR);
        }
      }
    }
  }

  /**
   * 官方 `GS`：从 (c,r) 沿 (horizontal? step=±1 方向) 直线逐格 +1 写距离（起点先写 Sc），
   * 遇占用(mn)或越界停；返回停时的行/列坐标。
   * `n` = 非水平方向时的步进；`o` = 是否水平；`r/l/h/a` = 边界。
   */
  private _GS(c: number, r: number, tc: number, tr: number, dir: number, horizontal: boolean, minC: number, maxC: number, minR: number, maxR: number): number {
    let cc = c | 0;
    let rr = r | 0;
    let occ = PositionArray.mn;
    let v = PositionArray.Sc;
    this._grid[cc][rr] = v;
    while (occ === PositionArray.mn && cc > minC && cc < maxC && rr > minR && rr < maxR) {
      v += 1;
      this._grid[cc][rr] = v;
      if (horizontal) rr += dir;
      else cc += dir;
      occ = this._grid[cc][rr];
    }
    return horizontal ? rr : cc;
  }

  /**
   * 官方 `qS(t,i,e,s,n,o,...)`：**从 (e,s)（目标端格）**沿 toDir 方向写 kg 常量线
   * （目标端“吸入”标记，Lo 抵达时会用真实距离覆盖；rV 用 To(目标) 读 kg 判断可达性）。
   * 前两参 t,i 官方保留未用。
   */
  private _qS(t: number, i: number, e: number, s: number, dir: number, horizontal: boolean, minC: number, maxC: number, minR: number, maxR: number): void {
    let cc = e | 0;
    let rr = s | 0;
    let occ = PositionArray.mn;
    const v = PositionArray.kg;
    this._grid[cc][rr] = v;
    while (occ === PositionArray.mn && cc > minC && cc < maxC && rr > minR && rr < maxR) {
      this._grid[cc][rr] = v;
      if (horizontal) rr += dir;
      else cc += dir;
      occ = this._grid[cc][rr];
    }
  }

  /**
   * 官方 `tR(fromPt, fromDir, toPt, toDir, bounds, usePath)`：
   * 从两端端口按方向做距离场。from 端用 GS 递增写距，to 端用 qS 写 kg 吸入线；
   * usePath=true 时先试 iR 直接路径（写成 Sc.. 的递增序列），失败则 Lo 四向扩散。
   * 两端格距 <=1 时置 tooClose 并直接返回。
   */
  tR(fromPt: PointLike, fromDir: number, toPt: PointLike, toDir: number, bounds: Rect, usePath: boolean): void {
    this.tooClose = false;
    let fx = fromPt.x;
    let fy = fromPt.y;
    if (!this.Pg(fx, fy)) return;
    fx -= this._minX;
    fx /= this._cellWidth;
    fy -= this._minY;
    fy /= this._cellHeight;
    let tx = toPt.x;
    let ty = toPt.y;
    if (!this.Pg(tx, ty)) return;
    tx -= this._minX;
    tx /= this._cellWidth;
    ty -= this._minY;
    ty /= this._cellHeight;
    if (Math.abs(fx - tx) <= 1 && Math.abs(fy - ty) <= 1) {
      this.tooClose = true;
      return;
    }
    // bounds → 单元格范围（GS/qS 写距的边界裁剪）
    let c0 = bounds.x;
    let r0 = bounds.y;
    let c1 = bounds.x + bounds.width;
    let r1 = bounds.y + bounds.height;
    c0 -= this._minX;
    c0 /= this._cellWidth;
    r0 -= this._minY;
    r0 /= this._cellHeight;
    c1 -= this._minX;
    c1 /= this._cellWidth;
    r1 -= this._minY;
    r1 /= this._cellHeight;
    const bMinC = Math.max(0, Math.min(this._maxCol, c0 | 0));
    const bMaxC = Math.min(this._maxCol, Math.max(0, c1 | 0));
    const bMinR = Math.max(0, Math.min(this._maxRow, r0 | 0));
    const bMaxR = Math.min(this._maxRow, Math.max(0, r1 | 0));
    const dir0 = 0;
    const dir90 = 90;
    const dir270 = 270;
    const grid = this._grid;
    const P = fx | 0;
    const A = fy | 0;
    const N = tx | 0;
    const M = ty | 0;
    const fromStep = fromDir === dir0 || fromDir === dir90 ? 1 : -1;
    const fromHorizontal = fromDir === dir90 || fromDir === dir270;
    if (grid[P][A] === PositionArray.mn) {
      this._GS(P, A, N, M, fromStep, fromHorizontal, bMinC, bMaxC, bMinR, bMaxR);
      this._GS(P, A, N, M, 1, !fromHorizontal, bMinC, bMaxC, bMinR, bMaxR);
      this._GS(P, A, N, M, -1, !fromHorizontal, bMinC, bMaxC, bMinR, bMaxR);
    } else {
      this._GS(P, A, N, M, fromStep, fromHorizontal, P, A, P, A);
    }
    const toStep = toDir === dir0 || toDir === dir90 ? 1 : -1;
    const toHorizontal = toDir === dir90 || toDir === dir270;
    if (grid[N][M] === PositionArray.mn) {
      this._qS(P, A, N, M, toStep, toHorizontal, bMinC, bMaxC, bMinR, bMaxR);
      this._qS(P, A, N, M, 1, !toHorizontal, bMinC, bMaxC, bMinR, bMaxR);
      this._qS(P, A, N, M, -1, !toHorizontal, bMinC, bMaxC, bMinR, bMaxR);
    } else {
      this._qS(P, A, N, M, fromStep, fromHorizontal, N, M, N, M);
    }
    const path: number[] = [];
    if (usePath && this._iR(N, M, toDir, P, A, path)) {
      if ((path[0] !== N || path[1] !== M)) {
        path.unshift(M);
        path.unshift(N);
      }
      const pl = path.length;
      if (path[pl - 2] !== P || path[pl - 1] !== A) {
        path.push(P);
        path.push(A);
      }
      let v = PositionArray.Sc;
      let cc = path[path.length - 2];
      let rr = path[path.length - 1];
      grid[cc][rr] = v++;
      for (let i = path.length - 4; i >= 0; i -= 2) {
        const nc = path[i + 2];
        const nr = path[i + 3];
        const oc = path[i];
        const or = path[i + 1];
        for (;;) {
          if (oc > cc) cc++;
          else if (oc < cc) cc--;
          else if (or > rr) rr++;
          else if (or < rr) rr--;
          grid[cc][rr] = v++;
          if (cc === oc && rr === or) break;
        }
      }
    } else {
      this.Lo(P, A, 1, false, bMinC, bMaxC, bMinR, bMaxR);
      this.Lo(P, A, -1, false, bMinC, bMaxC, bMinR, bMaxR);
      this.Lo(P, A, 1, true, bMinC, bMaxC, bMinR, bMaxR);
      this.Lo(P, A, -1, true, bMinC, bMaxC, bMinR, bMaxR);
    }
  }

  /**
   * 官方 `iR`：从 to 端格沿 toDir 逼近 from 端格，途遇分叉则转 90° 递归；
   * 成功时 `out` 为交替 (c,r) 路径点列，失败回溯清空（保留调用方 push 的内容语义）。
   * 途中把走过的格标成 wA 防止重入。
   */
  private _iR(c: number, r: number, dir: number, tc: number, tr: number, out: number[]): boolean {
    const grid = this._grid;
    let fc = c;
    let fr = r;
    for (;;) {
      if (fc === tc && fr === tr) return true;
      let dc = fc;
      let mr = fr;
      if (dir === 0) { if (dc < tc) dc++; else break; }
      else if (dir === 90) { if (mr < tr) mr++; else break; }
      else if (dir === 180) { if (dc > tc) dc--; else break; }
      else { if (mr > tr) mr--; else break; }
      const v = grid[dc][mr];
      if (v === PositionArray.mn || v === PositionArray.wA) break;
      fc = dc;
      fr = mr;
    }
    for (;;) {
      let nd = dir;
      let mc = fc;
      let mr2 = fr;
      if (dir === 0) {
        if (fr < tr) { nd = 90; mr2++; }
        else if (fr > tr) { nd = 270; mr2--; }
      } else if (dir === 90) {
        if (fc < tc) { nd = 0; mc++; }
        else if (fc > tc) { nd = 180; mc--; }
      } else if (dir === 180) {
        if (fr < tr) { nd = 90; mr2++; }
        else if (fr > tr) { nd = 270; mr2--; }
      } else {
        if (fc < tc) { nd = 0; mc++; }
        else if (fc > tc) { nd = 180; mc--; }
      }
      const v = grid[mc][mr2];
      if (nd !== dir && v !== 0 && v !== PositionArray.wA) {
        out.push(fc);
        out.push(fr);
        if (this._iR(fc, fr, nd, tc, tr, out)) return true;
        out.pop();
        out.pop();
      }
      grid[fc][fr] = PositionArray.wA;
      if (dir === 0) {
        if (fc === c) return false;
        fc--;
      } else if (dir === 90) {
        if (fr === r) return false;
        fr--;
      } else if (dir === 180) {
        if (fc === c) return false;
        fc++;
      } else {
        if (fr === r) return false;
        fr++;
      }
    }
  }
}

interface PointLike {
  x: number;
  y: number;
}
