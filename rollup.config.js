import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
// import babel from 'rollup-plugin-babel';

import pkg from './package.json';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    // babel({
    //   exclude: 'node_modules/**',
    // }),
    external(),
    postcss({
      modules: true,
    }),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      // exclude: "**/__tests__/**"
    }),
    commonjs({
      // include: ['node_modules/**'],
      // exclude: ['**/*.stories.js'],
      // namedExports: {
      //   'node_modules/react/react.js': [
      //     'Children',
      //     'Component',
      //     'PropTypes',
      //     'createElement',
      //   ],
      //   'node_modules/react-dom/index.js': ['render'],
      // },
    }),
  ],
};
