#!/usr/bin/env node
/**
 * 阶段 3 起的 API 表面验收脚本（不依赖 vitest，可直接 `npm run test:api`）。
 *
 * 对照 gojs@4.0.4 运行时，检查本项目 dist 的顶层导出：
 *   1. MISSING CLASSES        —— 只报告（阶段 4-7 逐步清零）
 *   2. MISSING ENUM OBJECTS   —— 必须为 0（阶段 3 验收）
 *   3. ENUM MEMBER DIFFS      —— 必须为 0（成员集合与官方一致）
 *   4. className 覆盖          —— 必须为 0（官方所有类都有 static className）
 *   5. prototype/static 缺口   —— 只报告计数（阶段 4-6 逐步缩减）
 *
 * 退出码非 0 表示有必检项不通过。
 */
const path = require('path');
const go = require('gojs/release/go.js');
const mod = require(path.join(__dirname, '..', 'dist', 'open-gojs.cjs.js'));
const open = mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod;

let failed = false;
const fail = (msg) => { failed = true; console.error('FAIL: ' + msg); };

function isPublicName(k) {
  if (k.length <= 2) return false;
  if (k.includes('$')) return false;
  if (k === '__gohashid') return false;
  if (/^[A-Z][a-z0-9]*$/.test(k) && k.length <= 3) return false;
  return true;
}
function isEnumObject(go, k) {
  return k !== 'version' && k !== 'default' && k.length > 2 && !k.includes('$') && typeof go[k] === 'object';
}
function collectPublicKeys(obj) {
  const keys = new Set();
  let o = obj;
  while (o && o !== Object.prototype && o !== Function.prototype) {
    for (const k of Object.getOwnPropertyNames(o)) {
      if (isPublicName(k) && k !== 'constructor') keys.add(k);
    }
    o = Object.getPrototypeOf(o);
  }
  return Array.from(keys).sort();
}
// 类的可访问 API = 原型链上的成员 ∪ 新实例上的自有字段。
// （本项目有部分类把官方的原型访问器实现成了实例字段，例如 Binding.mode、Layer.name，
//  用户侧访问方式完全一致，所以要一并算作"已具备"。）
function collectClassKeys(Ctor) {
  const keys = new Set(collectPublicKeys(Ctor.prototype));
  try {
    const inst = new Ctor();
    if (inst && typeof inst === 'object') {
      for (const k of Object.getOwnPropertyNames(inst)) {
        if (isPublicName(k)) keys.add(k);
      }
    }
  } catch (e) {
    // 构造需要参数/环境的类（如 Diagram 需要 div）直接跳过
  }
  return Array.from(keys).sort();
}

// ---- 1. classes ----
const officialClasses = Object.keys(go).filter(
  (k) => typeof go[k] === 'function' && /^[A-Z]/.test(k) && isPublicName(k)
);
const missingClasses = officialClasses.filter((k) => !(k in open));
console.log('[classes] official=' + officialClasses.length + ' missing=' + missingClasses.length);
if (missingClasses.length) console.log('  MISSING CLASSES: ' + missingClasses.join(', '));

// ---- 2. enum objects ----
const enumObjects = Object.keys(go).filter((k) => isEnumObject(go, k)).sort();
const missingEnums = enumObjects.filter((k) => !(k in open));
console.log('[enums] official=' + enumObjects.length + ' missing=' + missingEnums.length);
if (missingEnums.length) fail('MISSING ENUM OBJECTS: ' + missingEnums.join(', '));
else console.log('  MISSING ENUM OBJECTS: (none)');

// ---- 3. enum member sets ----
const enumDiffs = [];
for (const k of enumObjects) {
  const off = go[k];
  const op = open[k];
  if (!op) continue;
  const officialKeys = Object.keys(off).filter((m) => !/^\d+$/.test(m));
  const ourKeys = new Set(Object.keys(op));
  const miss = officialKeys.filter((m) => !ourKeys.has(m));
  const extra = Object.keys(op).filter((m) => !officialKeys.includes(m));
  if (miss.length) enumDiffs.push(k + ' missing[' + miss.join(',') + ']');
  if (extra.length) enumDiffs.push(k + ' extra[' + extra.join(',') + ']');
}
console.log('[enum members] diffs=' + enumDiffs.length);
if (enumDiffs.length) fail('ENUM MEMBER DIFFS: ' + enumDiffs.join(' | '));
else console.log('  ENUM MEMBER DIFFS: (none)');

// ---- 4. className ----
const ourClasses = Object.keys(open).filter(
  (k) => typeof open[k] === 'function' && /^[A-Z]/.test(k) && isPublicName(k)
);
const noClassName = officialClasses.filter((k) => k in open && !('className' in open[k]));
const ourNoClassName = ourClasses.filter((k) => !('className' in open[k]));
console.log('[className] official-without=' + officialClasses.filter((k) => !('className' in go[k])).length +
  ' our-missing=' + noClassName.length + ' our-classes-without=' + ourNoClassName.length);
if (noClassName.length) fail('official class without className in ours: ' + noClassName.join(', '));
if (ourNoClassName.length) fail('our class without className: ' + ourNoClassName.join(', '));

// ---- 5. prototype / static gaps (report only) ----
const focus = [
  'GraphObject', 'Diagram', 'Node', 'Link', 'Group', 'Part', 'Panel', 'Shape', 'TextBlock',
  'Picture', 'Adornment', 'Placeholder', 'Layer', 'RowColumnDefinition',
  'GraphLinksModel', 'TreeModel', 'Model', 'Binding', 'ChangedEvent', 'Transaction', 'UndoManager',
  'Layout', 'GridLayout', 'TreeLayout',
  'ForceDirectedLayout', 'CircularLayout', 'LayeredDigraphLayout', 'Point', 'Rect', 'Size',
  'Spot', 'Margin', 'Geometry', 'Brush', 'Tool', 'ToolManager', 'CommandHandler',
  'List', 'Set', 'Map',
];
let protoTotal = 0;
let staticTotal = 0;
const rows = [];
for (const cls of focus) {
  const off = go[cls];
  const op = open[cls];
  if (!off || !op) continue;
  const offProto = collectClassKeys(off);
  const opProto = collectClassKeys(op);
  const missP = offProto.filter((k) => !opProto.includes(k));
  const offStatic = collectPublicKeys(off);
  const opStatic = collectPublicKeys(op);
  const missS = offStatic.filter((k) => !opStatic.includes(k));
  protoTotal += missP.length;
  staticTotal += missS.length;
  rows.push({ cls, p: missP.length, s: missS.length });
}
rows.sort((a, b) => b.p - a.p || b.s - a.s);
console.log('[members] prototype missing total=' + protoTotal + ', static missing total=' + staticTotal);
for (const r of rows) console.log('    ' + r.cls.padEnd(22) + ' proto=' + String(r.p).padStart(4) + ' static=' + String(r.s).padStart(4));

// ---- 6. `--names <Class>`: 打印某个 focus 类的具体缺失成员名 ----
const nameIdx = process.argv.indexOf('--names');
if (nameIdx >= 0) {
  const cls = process.argv[nameIdx + 1];
  const off = go[cls];
  const op = open[cls];
  if (!off || !op) {
    console.error('unknown class for --names: ' + cls);
    process.exit(2);
  }
  const missP = collectClassKeys(off).filter((k) => !collectClassKeys(op).includes(k));
  const missS = collectPublicKeys(off).filter((k) => !collectPublicKeys(op).includes(k));
  console.log('\n[' + cls + '] proto missing (' + missP.length + '): ' + missP.join(', '));
  console.log('[' + cls + '] static missing (' + missS.length + '): ' + missS.join(', '));
}

if (failed) {
  console.error('\nAPI ACCEPTANCE FAILED');
  process.exit(1);
}
console.log('\nAPI ACCEPTANCE PASSED');
