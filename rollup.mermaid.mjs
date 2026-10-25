// Mermaid 独立 UMD 构建：核心 src/ + 扩展 extension/mermaid → dist/open-gojs-mermaid.umd.js
// （全局名 go，含 go.Mermaid 命名空间）。与主配置 rollup.config.mjs 并列，互不影响。
// 构建：npx rollup -c rollup.mermaid.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'extension/mermaid/bundle.ts',
  output: {
    file: 'dist/open-gojs-mermaid.umd.js',
    format: 'umd',
    name: 'go',
    sourcemap: false,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    // 与主构建保持一致：样例可用 constructor.name 反射
    terser({ keep_classnames: true, keep_fnames: true }),
  ],
};
