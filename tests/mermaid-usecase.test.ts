import { describe, it, expect } from 'vitest';
import { parseUsecase, isUsecase } from '../extension/mermaid/parser/usecase';
import { mapUsecase } from '../extension/mermaid/mapper/usecase';

describe('usecase-beta', () => {
  it('isUsecase 识别头行', () => {
    expect(isUsecase('usecase-beta\nactor a')).toBe(true);
    expect(isUsecase('usecase-beta LR\nactor a')).toBe(true);
    expect(isUsecase('flowchart TD\na-->b')).toBe(false);
  });

  it('解析 actor/用例/boundary/四类关系', () => {
    const ast = parseUsecase(`
usecase-beta LR
actor user("普通用户")
actor business admin
login
check["校验密码"]
systemBoundary sys["系统"] {
  login
  check
}
user --> login
login ..> check : include
login ..> fallback : extend
admin --|> user
`);
    expect(ast.kind).toBe('usecase');
    expect(ast.dir).toBe('LR');
    expect(ast.actors).toHaveLength(2);
    expect(ast.actors[0]).toEqual({ id: 'user', label: '普通用户' });
    expect(ast.actors[1]).toEqual({ id: 'admin', label: 'admin', business: true });
    // login（boundary 内裸声明）、check（矩形）、fallback（关系先于声明 → 隐式椭圆）
    const login = ast.cases.find(c => c.id === 'login')!;
    expect(login.label).toBe('login');
    expect(login.rect).toBeUndefined();
    const check = ast.cases.find(c => c.id === 'check')!;
    expect(check.label).toBe('校验密码');
    expect(check.rect).toBe(true);
    const fallback = ast.cases.find(c => c.id === 'fallback')!;
    expect(fallback.label).toBe('fallback');
    expect(ast.boundaries).toHaveLength(1);
    expect(ast.boundaries[0].id).toBe('sys');
    expect(ast.boundaries[0].title).toBe('系统');
    expect(ast.boundaries[0].members).toEqual(['login', 'check']);
    expect(ast.relations).toHaveLength(4);
    expect(ast.relations[0]).toEqual({ from: 'user', to: 'login', kind: 'assoc' });
    expect(ast.relations[1]).toEqual({ from: 'login', to: 'check', kind: 'include', label: '<<include>>' });
    expect(ast.relations[2]).toEqual({ from: 'login', to: 'fallback', kind: 'extend', label: '<<extend>>' });
    expect(ast.relations[3]).toEqual({ from: 'admin', to: 'user', kind: 'generalization' });
  });

  it('容错：注释/未知行忽略、裸引号文本、id 冲突改名、关系先于声明', () => {
    const ast = parseUsecase(`
usecase-beta
%% 这是注释
garbage line here
"下单流程"
actor x
x("用例X")
a --> b
`);
    // 未知行与注释被忽略；裸引号文本生成用例
    const bare = ast.cases.find(c => c.label === '下单流程')!;
    expect(bare).toBeTruthy();
    // actor x 与用例 x("用例X") id 冲突 → 用例改名
    expect(ast.actors.map(a => a.id)).toEqual(['x']);
    const renamed = ast.cases.find(c => c.label === '用例X')!;
    expect(renamed.id).not.toBe('x');
    // 关系端点 a/b 补成隐式用例
    expect(ast.cases.map(c => c.id)).toContain('a');
    expect(ast.cases.map(c => c.id)).toContain('b');
    expect(ast.relations).toEqual([{ from: 'a', to: 'b', kind: 'assoc' }]);
  });

  it('mapper：三层布局、坐标合法、颜色取自主题', () => {
    const ast = parseUsecase(`
usecase-beta
actor user("用户")
login
check["校验"]
systemBoundary sys["系统"] {
  login
  check
}
extra("松散")
user --> login
login ..> check : include
`);
    const { nodes, links, dir } = mapUsecase(ast);
    expect(dir).toBe('TD');
    // 1 actor + 2 组内用例 + 1 松散用例 + 1 组盒
    expect(nodes).toHaveLength(5);
    for (const n of nodes) {
      expect(n.loc).toMatch(/^-?\d+ -?\d+$/);
      expect(n.w).toBeGreaterThan(0);
      expect(n.h).toBeGreaterThan(0);
    }
    const proc = nodes.filter(n => n.category !== 'GroupBox');
    for (const n of proc) {
      expect(n.fill).toBe('#00A6ED');
      expect(n.stroke).toBe('#0077B6');
      expect(n.textCol).toBe('#000000');
    }
    const y = (k: string) => parseInt(nodes.find(n => n.key === k)!.loc.split(' ')[1], 10);
    const gbox = nodes.find(n => n.key === 'sys')!;
    expect(gbox.category).toBe('GroupBox');
    expect(gbox.title).toBe('系统');
    expect(gbox.members).toEqual(['login', 'check']);
    expect(gbox.fill).toBe('#F2F6FA');
    // 三层：actors 在上 → boundary 层 → 松散用例在下
    expect(y('user')).toBeLessThan(y('sys'));
    expect(y('sys')).toBeLessThan(y('extra'));
    expect(nodes.find(n => n.key === 'check')!.category).toBe('UsecaseRect');
    expect(nodes.find(n => n.key === 'login')!.category).toBe('Usecase');
    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({ from: 'user', to: 'login', kind: 'assoc' });
    expect(links[1]).toEqual({ from: 'login', to: 'check', kind: 'include', label: '<<include>>' });
  });

  it('mapper：BT 方向整体镜像（下游在上）', () => {
    const ast = parseUsecase(`
usecase-beta BT
actor a
b("x")
a --> b
`);
    const { nodes } = mapUsecase(ast);
    const y = (k: string) => parseInt(nodes.find(n => n.key === k)!.loc.split(' ')[1], 10);
    expect(y('b')).toBeLessThan(y('a'));
  });

  it('mapper：两端未知节点的连线被丢弃（直接喂 AST）', () => {
    // parser 会把关系端点补成隐式用例，正常路径不会出现悬空端点；
    // mapper 的守卫直接用手工 AST 验证
    const { links } = mapUsecase({
      kind: 'usecase',
      dir: 'TD',
      actors: [{ id: 'a', label: 'a' }],
      cases: [],
      boundaries: [],
      relations: [{ from: 'a', to: 'ghost', kind: 'assoc' }],
    });
    expect(links).toHaveLength(0);
  });
});
