// ESM 专用入口：官方 gojs go.mjs 提供 default 导出（样例代码 `import go from 'gojs'`），
// 这里补上同样的 default，保持与官方模块产物兼容。
import * as go from './index';

export * from './index';
export default go;
