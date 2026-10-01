import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';

export default [
  // UMD build
  {
    input,
    output: {
      file: 'dist/open-gojs.umd.js',
      format: 'umd',
      name: 'go',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      // 官方 release 包保留类名/函数名：样例代码会用 `cls.name`、`constructor.name`
      // 反射自己的 API（比如 classHierarchy 遍历 for (const k in go) 取 base.name 建树）。
      // terser 默认会把类名压成 e/t/w，导致父子关系全丢。
      terser({ keep_classnames: true, keep_fnames: true }),
    ],
  },
  // ESM build
  {
    input,
    output: {
      file: 'dist/open-gojs.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  // CJS build
  {
    input,
    output: {
      file: 'dist/open-gojs.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  // Type declarations
  {
    input,
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];
