/**
 * UMD 打包入口（仅供根目录 rollup.mermaid.mjs 使用）。
 *
 * 把核心 go 命名空间与 extension/mermaid 合并打进单个
 * dist/open-gojs-mermaid.umd.js（全局名 `go`），
 * 示例页只需一个 <script> 即可同时使用 go.* 与 go.Mermaid。
 */
export * from '../../src/index';
export { Mermaid } from './index';
