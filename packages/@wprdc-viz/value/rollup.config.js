import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  cache: true,
  output: [

    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      
    },
  ],
  plugins: [
    peerDepsExternal(),
    postcss({ modules: true }),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
};