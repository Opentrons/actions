import { join } from 'path'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const input = ({ packageName }) => ({
  input: join(packageName, 'src', 'main.ts'),
})

const output = ({ packageName }) => ({
  output: [
    {
      file: join(packageName, 'dist', 'main.js'),
      format: 'cjs',
      sourcemap: true,
    },
  ],
})

const plugins = ({ browser }) => ({
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      exclude: '**/node_modules/**',
      rootMode: 'upward',
    }),
    resolve({
      preferBuiltins: true,
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
    }),
    commonjs(),
  ],
})

const createConfig = (options) => ({
  ...input(options),
  ...output(options),
  ...plugins(options),
})

const packages = []

export default packages.map(createConfig)
