/**
 * Mermaid DSL 词法分析器 —— 逐字符扫描产出 Token 流。
 *
 * 按换行为语句分隔，识别标识符/字符串/数字/连边符号/形状括号/关键字。
 * `%%` 到行尾视为注释，忽略。
 */

/** Token 类别 */
export type TokenKind =
  | 'ident'        // 标识符（含中文/通用字符）
  | 'str'          // 引号字符串
  | 'num'          // 数字
  | 'arrow'        // 连边符号 --> -->> ==> -.-> -x 等
  | 'shapeOpen'    // 形状起始 [ ( { [[ (( [(
  | 'shapeClose'   // 形状结束 ] ) } ]] )) ])
  | 'punct'        // 标点 : | ; , 等
  | 'newline'
  | 'comment'      // %% 注释内容（可忽略）
  | 'eof';

/** Token */
export interface Token {
  kind: TokenKind;
  value: string;
  line: number;
  col: number;
}

/** 连边符号集合（长→短匹配） */
const ARROWS: string[] = [
  '==>' , '-->>', '-.->', '===',  '--->', '---',
  '-->' , '==>',  '--x',  '-x',   '-)>',  '-->',
  '<-->', 'o--',  '..>',  '--o',  'o==',  '..',
  '<==>', '==x',  '-..',  'o--x', 'x--x', '<==',
  '<<-', '-<',   '--',   '-',    '=>',   '<-',
];

/** 形状起始与闭合配对 */
const SHAPE_OPEN: Record<string, string> = {
  '[': ']',
  '(': ')',
  '{': '}',
  '[[': ']]',
  '((': '))',
  '[(': ')]',
  '([': ')]',
  '[/': '/]',
  '{{': '}}',
  '[\\': '\\]',
};

/** 箭头符号里可能嵌的标签分隔（|text| 或 :text） */
export const PUNCT = new Set([':', '|', ';', ',', '=', '~', '&']);

/** 需要特殊识别为标识符关键字的前缀 */
const KEYWORDS = new Set([
  'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
  'stateDiagram-v2', 'erDiagram', 'gantt', 'pie', 'subgraph', 'direction',
  'participant', 'actor', 'note', 'over', 'loop', 'alt', 'else', 'opt',
  'par', 'and', 'activate', 'deactivate', 'class', 'state', 'linkStyle',
  'classDef', 'title', 'section', 'dateFormat', 'axisFormat', 'start',
  'end', 'of', 'as', 'autonumber',
]);

/** 判断一段字符是否属于连边符号（用于最长匹配） */
function isArrowPrefix(s: string, pos: number): boolean {
  // 与 ARROWS 里的某项前缀匹配
  for (const a of ARROWS) {
    if (s.startsWith(a, pos)) return true;
  }
  return false;
}

/** 判断某字符是否标识符的一部分（含中文、字母、数字、_、-、.、#） */
function isIdentChar(c: string): boolean {
  if (!c) return false;
  if (/[a-zA-Z0-9_\-.#]/.test(c)) return true;
  // 常见 CJK / 全角
  return /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef\u2000-\u206f]/.test(c);
}

/**
 * 词法分析主入口。
 * @param src Mermaid DSL 文本
 * @returns Token 数组（含 eof 结尾）
 */
export function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let col = 0;
  const n = src.length;

  const push = (kind: TokenKind, value: string) => {
    tokens.push({ kind, value, line, col: col - value.length + 1 });
  };

  while (pos < n) {
    const c = src[pos];

    // 换行
    if (c === '\n') {
      push('newline', '\n');
      pos++;
      line++;
      col = 0;
      continue;
    }
    // 空白（空格/Tab/回车）
    if (c === ' ' || c === '\t' || c === '\r') {
      pos++;
      col++;
      continue;
    }
    // 注释 %%
    if (c === '%' && src[pos + 1] === '%') {
      let j = pos;
      while (j < n && src[j] !== '\n') j++;
      push('comment', src.slice(pos, j));
      pos = j;
      col += j - pos + 1;
      continue;
    }
    // 引号字符串
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      let j = pos + 1;
      while (j < n && src[j] !== quote) j++;
      const val = src.slice(pos + 1, j);
      push('str', val);
      pos = j < n ? j + 1 : j;
      col += (j - pos) + 1;
      continue;
    }

    // 连边符号 —— 尝试最长匹配
    let arrowLen = 0;
    for (const a of ARROWS) {
      if (src.startsWith(a, pos) && a.length > arrowLen) arrowLen = a.length;
    }
    if (arrowLen > 0) {
      // 检查是否有嵌入标签如 |text| 或 :label
      let value = src.slice(pos, pos + arrowLen);
      // 若箭头后面紧跟 | 或 : 且匹配到闭合，则并入标签（交给 parser 处理，这里只认箭头）
      push('arrow', value);
      pos += arrowLen;
      col += arrowLen;
      continue;
    }

    // 数字
    if (/[0-9]/.test(c)) {
      let j = pos;
      while (j < n && /[0-9]/.test(src[j])) j++;
      if (src[j] === '.' && /[0-9]/.test(src[j + 1] || '')) {
        j++;
        while (j < n && /[0-9]/.test(src[j])) j++;
      }
      push('num', src.slice(pos, j));
      pos = j;
      col += j - pos + 1;
      continue;
    }

    // 形状起始（多字符优先）
    const two = src.slice(pos, pos + 2);
    if (SHAPE_OPEN[two]) {
      push('shapeOpen', two);
      pos += 2;
      col += 2;
      continue;
    }
    if (SHAPE_OPEN[c]) {
      push('shapeOpen', c);
      pos++;
      col++;
      continue;
    }
    // 形状闭合（多字符优先）
    const closeTwo = src.slice(pos, pos + 2);
    if (closeTwo === ']]' || closeTwo === '))' || closeTwo === ')]' ||
        closeTwo === '/]' || closeTwo === '\\]' || closeTwo === '}}') {
      push('shapeClose', closeTwo);
      pos += 2;
      col += 2;
      continue;
    }
    if (c === ']' || c === ')' || c === '}' || c === '/' || c === '\\') {
      // 注意：/ 可能是闭合的 /]；单独 / 视为标点
      push('shapeClose', c);
      pos++;
      col++;
      continue;
    }

    // 标点
    if (PUNCT.has(c)) {
      push('punct', c);
      pos++;
      col++;
      continue;
    }

    // 标识符（含中文）
    if (isIdentChar(c)) {
      let j = pos;
      while (j < n && isIdentChar(src[j])) j++;
      push('ident', src.slice(pos, j));
      pos = j;
      col += j - pos + 1;
      continue;
    }

    // 其它单字符 —— 视为标识符/标点兜底
    push('ident', c);
    pos++;
    col++;
  }

  push('eof', '<eof>');
  return tokens;
}

/**
 * 去掉注释与空白 token，返回有效 token 流（保留 newline/eof）。
 */
export function stripComments(tokens: Token[]): Token[] {
  return tokens.filter(t => t.kind !== 'comment');
}

/** 是否"词型"token（ident/num/str）——连续词之间需要空格 */
function isWordToken(t: Token): boolean {
  return t.kind === 'ident' || t.kind === 'num' || t.kind === 'str';
}

/**
 * 智能把 token 拼回文本：连续两个词型 token 之间补空格，
 * 符号/箭头/标点紧贴（保证 `A<|--B` 连续、`int id PK` 分词）。
 * 用于需要还原行文本的解析器（成员/属性/关系行）。
 */
export function smartJoin(tokens: Token[]): string {
  let out = '';
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (i > 0) {
      const prev = tokens[i - 1];
      if (isWordToken(prev) && isWordToken(t)) out += ' ';
    }
    out += t.value;
  }
  return out;
}