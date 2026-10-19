/**
 * Mermaid swimlane-beta 语法分析器 —— 复用 flowchart 全链。
 *
 * 首行 `swimlane-beta [方向]` 当作 flowchart 头处理：
 * 把首行替换为 `flowchart TB`（或按方向 LR 等）后调用 parseFlowchart，
 * 返回 FlowchartAST。顶层 subgraph 即泳道（现有 flowchart render 的
 * GroupBox 已能呈现容器效果）。
 */
import { FlowchartAST } from '../ast';
import { parseFlowchart } from './flowchart';

/** 判断是否 swimlane-beta */
export function isSwimlanes(text: string): boolean {
  return /^swimlane-beta\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 swimlanes DSL（内部转成 flowchart 文本后复用 parseFlowchart） */
export function parseSwimlanes(src: string): FlowchartAST {
  const lines = src.split(/\r?\n/);
  let dir = 'TB';
  let start = 0;
  const first = (lines[0] || '').trim();
  const m = /^swimlane-beta(?:\s+(\S+))?/i.exec(first);
  if (m) {
    start = 1;
    if (m[1] && /^(TD|TB|BT|LR|RL)$/i.test(m[1])) dir = m[1].toUpperCase();
  }
  const rest = lines.slice(start).join('\n');
  return parseFlowchart(`flowchart ${dir}\n${rest}`);
}
