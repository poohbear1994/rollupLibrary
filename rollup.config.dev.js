/* eslint-disable */
import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import json from 'rollup-plugin-json'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import ts from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const inputPath = path.resolve(__dirname, './src/index.ts')
const distPath = path.resolve(__dirname, './dist')
const outputPath = path.resolve(__dirname, './dist/index.umd.js')
const cjsOutputPath = path.resolve(__dirname, './dist/index.cjs.js')
const esOutputPath = path.resolve(__dirname, './dist/index.es.js')

// node环境默认不识别ESM
export default {
	// 打包入口
	input: inputPath,
	// 打包出口
	output: [
		{
			// 指定文件打包输出路径
			file: outputPath,
			// 指定文件打包输出模块格式
			format: 'umd',
			// 指定文件打包输出的名字
			name: 'index',
			globals: { vue: 'Vue' },
			exports: 'named',
		},
		{
			// 指定文件打包输出路径
			file: cjsOutputPath,
			// 指定文件打包输出模块格式
			format: 'cjs',
			// 指定文件打包输出的名字
			name: 'index',
			globals: { vue: 'Vue' },
			exports: 'named',
		},
		{
			// 指定文件打包输出路径
			file: esOutputPath,
			// 指定文件打包输出模块格式
			format: 'es',
			// 指定文件打包输出的名字
			name: 'index',
			global: { vue: 'Vue' },
			exports: 'named',
		},
	],
	// 配置插件
	plugins: [
		// resolve会将外部用到的模块全部打包到项目里面
		resolve({
			extensions: ['.js', '.ts'],
		}),
		commonjs(),
		ts({
			tsconfig: path.resolve(__dirname, 'tsconfig.json'),
		}),
		// 将ES6语法转换为ES5语法
		babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
		json(),
		vue(),
		postcss({ plugins: [] }),
		// terser()
	],
	// 不需要打包的模块
	external: ['vue', 'lodash', 'element-plus', '@element-plus/icons-vue'],
}
