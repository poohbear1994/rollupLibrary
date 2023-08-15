import { fileURLToPath } from 'node:url'
import resolve from '@rollup/plugin-node-resolve'
// import { babel } from '@rollup/plugin-babel'
import swc from '@rollup/plugin-swc'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import ts from 'rollup-plugin-typescript2'
import vue from '@vitejs/plugin-vue'
import postcss from 'rollup-plugin-postcss'
import { visualizer } from 'rollup-plugin-visualizer'

const inputPath = fileURLToPath(new URL('src/index.ts', import.meta.url))
const esOutputPath = fileURLToPath(new URL('dist/index.mjs', import.meta.url))
const cjsOutputPath = fileURLToPath(new URL('dist/index.js', import.meta.url))
const tsConfigPath = fileURLToPath(new URL('tsconfig.json', import.meta.url))

// node环境默认不识别ESM
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
	cache: false,
	// 打包入口
	input: inputPath,
	// 打包出口
	output: [
		{
			// 指定文件打包输出路径
			file: esOutputPath,
			// 指定文件打包输出模块格式
			format: 'es',
			// 指定文件打包输出的名字
			name: 'index',
			exports: 'named',
		},
		{
			file: cjsOutputPath,
			format: 'cjs',
			name: 'index',
			exports: 'named',
		},
	],
	// 配置插件
	plugins: [
		// resolve会将外部用到的模块全部打包到项目里面
		resolve({
			extensions: ['.js', '.ts'],
		}),
		ts({
			tsconfig: tsConfigPath,
		}),
		// 将ES6语法转换为ES5语法
		// babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
		commonjs(),
		json(),
		vue(),
		postcss({ plugins: [] }),
		swc(),
		terser(),
		visualizer({
			open: true,
			filename: 'stats.html',
			gzipSize: true,
			brotliSize: true,
		}),
	],
	// 不需要打包的模块
	external: ['vue', 'lodash', 'element-plus', '@element-plus/icons-vue'],
}
