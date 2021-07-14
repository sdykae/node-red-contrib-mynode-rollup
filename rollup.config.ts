import { RollupOptions, Plugin, SourceMapInput, LoadResult } from 'rollup';
import { default as typescript } from '@rollup/plugin-typescript';
import packageJson from './package.json';
import { join } from 'path';
import { dirname } from 'path/posix';
import { sync } from 'glob';
import { readFileSync } from 'fs';

const allNodeTypes = Object.keys(packageJson['node-red'].nodes);

const htmlWatch = (): Plugin => {
  return {
    name: 'htmlWatch',
    load(id): LoadResult {
      const editorDir = dirname(id);
      const htmlFiles = sync(join(editorDir, '*.html'));
      htmlFiles.map((file) => this.addWatchFile(file));
      return undefined;
    },
  };
};
const htmlBundle = (): Plugin => {
  return {
    name: 'htmlBundle',
    renderChunk(code, chunk, _options): { code: string; map?: SourceMapInput } {
      const editorDir = dirname(chunk.facadeModuleId!);
      const htmlFiles = sync(join(editorDir, '*.html'));
      const htmlContents = htmlFiles.map((fsPath) =>
        readFileSync(fsPath, 'utf-8'),
      );
      code =
        '<script type="text/javascript">\n' +
        code +
        '\n' +
        '</script>\n' +
        htmlContents.join('\n');
      return { code, map: { mappings: '' } };
    },
  };
};
const makeWebPlugins = (nodeType: string): Plugin[] => [
  htmlWatch(),
  typescript({
    tsconfig: './tsconfig.web.json',
    include: [
      `src/nodes/${nodeType}/${nodeType}.html/**/*.ts`,
      `src/nodes/${nodeType}/shared/**/*.ts`,
      'src/nodes/shared/**/*.ts',
    ],
  }),
  htmlBundle(),
];
const makeConfigItemWeb = (nodeType: string): RollupOptions => ({
  input: `src/nodes/${nodeType}/${nodeType}.html/index.ts`,
  output: {
    file: `dist/nodes/${nodeType}/${nodeType}.html`,
    format: 'iife',
    sourcemap: false,
  },
  plugins: makeWebPlugins(nodeType),
  watch: {
    clearScreen: false,
  },
});

const makeNodePlugins = (nodeType: string): Plugin[] => [
  typescript({
    tsconfig: './tsconfig.node.json',
    include: [`src/nodes/${nodeType}/**/*.ts`, 'src/nodes/shared/**/*.ts'],
    exclude: [`src/nodes/${nodeType}/${nodeType}.html/**/*.ts`],
  }),
];
const makeConfigItemNode = (nodeType: string): RollupOptions => ({
  input: `src/nodes/${nodeType}/index.ts`,
  output: {
    file: `dist/nodes/${nodeType}/${nodeType}.js`,
    format: 'commonjs',
    sourcemap: false,
  },
  plugins: makeNodePlugins(nodeType),
  watch: {
    clearScreen: false,
  },
});
export default [
  ...allNodeTypes.map(makeConfigItemWeb),
  ...allNodeTypes.map(makeConfigItemNode),
];
