/* import nodeResolve from 'rollup-plugin-node-resolve' // 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel' // rollup 的 babel 插件，ES6转ES5
import replace from 'rollup-plugin-replace' // 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import commonjs from 'rollup-plugin-commonjs' // 将非ES6语法的包转为ES6可用
import uglify from 'rollup-plugin-uglify' */

/*
    rollup 配置文件
*/
import postcss from "rollup-plugin-postcss";
import { eslint } from "rollup-plugin-eslint";
import commonjs from "rollup-plugin-commonjs";
import clear from "rollup-plugin-clear";
import external from "rollup-plugin-peer-deps-external";
import url from "rollup-plugin-url";

import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
import json from "rollup-plugin-json";
import multiEntry from "rollup-plugin-multi-entry";

import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";
import path from 'path';

const env = process.env.NODE_ENV
var plugins=[
		postcss({
			extensions: [".pcss", ".less", ".css"],
			plugins: [nested(), cssnext({
				warnForDuplicates: false
			}), cssnano()],
			extract: false // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
		}),
		url(),
		babel({
			exclude: ["node_modules/**"],
			runtimeHelpers: true
		}),
		//resolve(),
		commonjs({
			include: ["node_modules/**"]
		}),
		json(),
		//eslint({
			//include: ["src/**/*.js"],
			//exclude: ["ol/**/*.js","node_module/**"]
		//}), 
		replace({
			"process.env.NODE_ENV": JSON.stringify(env)
		}),
		//env === "production" && uglify()
	];
export default [
	//目录
	{
		input: 'gisq/gisqOlMobile.js',
		output: {
			file: 'lib/gisqOlMobile.js', // 输出文件
			format: 'umd', //  五种输出格式：amd /  es6 / iife / umd / cjs
			name: 'gisqOlMobile', //当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
			sourcemap: false //生成bundle.map.js文件，方便调试
		},
		//告诉rollup不要将此lodash打包，而作为外部依赖
		external: ["shpjs","proj4","ol","ol-mapbox-style","pbf","rbush"],
		/* global:{
		    'plus':'plus'              //告诉rollup 全局变量$即是jquery
		}, */
		// 是否开启代码分割
		experimentalCodeSplitting: true,
		plugins: plugins,
		onwarn:function (warning) {
			if (warning.code === 'THIS_IS_UNDEFINED'||warning.code ==='PLUS_IS_UNDEFINED' ) {
				return;
			}
		}
	}
	
	
];
/* if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
} */
