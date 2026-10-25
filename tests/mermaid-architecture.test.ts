import { describe, it, expect } from 'vitest';
import { parseArchitecture, isArchitecture } from '../extension/mermaid/parser/architecture';
import { mapArchitecture } from '../extension/mermaid/mapper/architecture';

describe('architecture-beta', () => {
  it('isArchitecture 识别头行', () => {
    expect(isArchitecture('architecture-beta\nservice a(x)[A]')).toBe(true);
    expect(isArchitecture('architecture\nservice a(x)[A]')).toBe(true);
    expect(isArchitecture('flowchart TD\na-->b')).toBe(false);
  });

  it('解析 group/service/db/连线（含端口与图标容错）', () => {
    const ast = parseArchitecture(`
architecture-beta
group aws(gcp)[AWS Cloud]
service api(gcp)[API Gateway] in aws
db users(sql)[Users DB] in aws
service svc2(srv)[Second Service]
api:R -> L:users
api -> svc2
`);
    expect(ast.kind).toBe('architecture');
    expect(ast.groups).toEqual([{ alias: 'aws', label: 'AWS Cloud' }]);
    expect(ast.services).toEqual([
      { alias: 'api', label: 'API Gateway', group: 'aws' },
      { alias: 'users', label: 'Users DB', group: 'aws' },
      { alias: 'svc2', label: 'Second Service' },
    ]);
    expect(ast.conns).toEqual([
      { from: 'api', fromPort: 'R', to: 'users', toPort: 'L' },
      { from: 'api', fromPort: 'R', to: 'svc2', toPort: 'L' },
    ]);
  });

  it('容错：注释/未知行忽略、小写端口归一、重复别名去重', () => {
    const ast = parseArchitecture(`
architecture-beta
%% 注释
bogus line without syntax
service a(x)[A]
service a(y)[Again]
service b(x)[B]
a:r -> l:b
`);
    expect(ast.services).toHaveLength(2);
    expect(ast.services[0]).toEqual({ alias: 'a', label: 'A' });
    expect(ast.conns).toEqual([
      { from: 'a', fromPort: 'R', to: 'b', toPort: 'L' },
    ]);
  });

  it('mapper：组盒在上、组内服务在盒内、组外服务在下、坐标合法', () => {
    const ast = parseArchitecture(`
architecture-beta
group aws(gcp)[AWS Cloud]
service api(gcp)[API Gateway] in aws
db users(sql)[Users DB] in aws
service svc2(srv)[Second Service]
api:R -> L:users
api -> svc2
`);
    const { nodes, links } = mapArchitecture(ast);
    // aws 组盒 + 3 服务
    expect(nodes).toHaveLength(4);
    for (const n of nodes) {
      expect(n.loc).toMatch(/^-?\d+ -?\d+$/);
      expect(n.w).toBeGreaterThan(0);
      expect(n.h).toBeGreaterThan(0);
    }
    const byKey = new Map(nodes.map(n => [n.key, n]));
    const box = byKey.get('aws')!;
    expect(box.category).toBe('GroupBox');
    expect(box.title).toBe('AWS Cloud');
    expect(box.members).toEqual(['api', 'users']);
    const xy = (k: string) => byKey.get(k)!.loc.split(' ').map(Number);
    // 组内服务位于组盒内部（盒左上为 loc，TopLeft spot）
    for (const m of box.members!) {
      const n = byKey.get(m)!;
      const [x, y] = xy(m);
      expect(x).toBeGreaterThanOrEqual(xy('aws')[0]);
      expect(y).toBeGreaterThanOrEqual(xy('aws')[1]);
      expect(x + n.w).toBeLessThanOrEqual(xy('aws')[0] + box.w);
      expect(y + n.h).toBeLessThanOrEqual(xy('aws')[1] + box.h);
    }
    // 组外服务在组盒带下方
    expect(xy('svc2')[1]).toBeGreaterThanOrEqual(xy('aws')[1] + box.h);
    // 颜色取自主题（默认黑白 + 浅灰组盒）
    for (const n of nodes.filter(x => x.category === 'Service')) {
      expect(n.fill).toBe('#00A6ED');
      expect(n.stroke).toBe('#0077B6');
      expect(n.textCol).toBe('#000000');
    }
    expect(box.fill).toBe('#F2F6FA');
    // 连线保留端口
    expect(links).toEqual([
      { from: 'api', fromPort: 'R', to: 'users', toPort: 'L' },
      { from: 'api', fromPort: 'R', to: 'svc2', toPort: 'L' },
    ]);
  });

  it('mapper：未声明组的服务直接放外部；未知端点连线丢弃', () => {
    const ast = parseArchitecture(`
architecture-beta
service a(x)[A]
a:R -> L:ghost
`);
    const { nodes, links } = mapArchitecture(ast);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].category).toBe('Service');
    expect(links).toHaveLength(0);
  });
});
