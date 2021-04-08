const IS_PROD = process.env.NODE_ENV === 'production'
const path = require('path');
console.log("IS_PROD===" + IS_PROD)
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	//some configs
	publicPath: IS_PROD ? "./" : "./", //部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)

	outputDir: 'dist', //运行时生成的生产环境构建文件的目录(默认'dist'，构建之前会被清除)
	assetsDir: 'static', //静态资源目录(js、css、img、fonts)，相对outputDir的目录(默认'')
	indexPath: 'index.html', //指定生成index.html的输出路径(相对outputDir)也可以是绝对路径
	lintOnSave: true, //是否开启ESlint（保存时检查）
	productionSourceMap: true, //生产环境是否生成 sourceMap 文件
	pages: { //pages里配置的路径和文件名在你的文档目录必须存在，否则启动服务会报错
		index: { //除了 entry 之外都是可选的
			entry: 'src/main.js', //page的主入口
			template: 'public/index.html', //模板来源
			filename: 'index.html', //在 dist/index.html 的输出
			//title在template中使用：<title><%=htmlWebpackPlugin.options.title%></title>
			title: '生成的配置信息',
			chunks: ['chunk-vendors', 'chunk-common', 'index']
			// 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
		}
		/* ,
				subpage: 'src/subpage/main.js' */
		//官方解释：当使用只有入口的字符串格式时，模板会被推导为public/subpage.html
		//若找不到就回退到public/index.html，输出文件名会被推导为subpage.html
	},
	css: {
		extract: false, //是否使用css分离插件 ExtractTextPlugin
		sourceMap: true, //开启 CSS source maps
		loaderOptions: {
			css: {

			},
		}, //css预设器配置项
		modules: false //启用CSS modules for all css / pre-processor files.
	},
	devServer: { //环境配置
		host: '0.0.0.0',
		port: 30085,
		disableHostCheck: true,
		https: false, //是否开启https
		hotOnly: false, //是否配置热更新
		open: false, //配置自动启动浏览器
		proxy: { //配置多个代理跨域(配置一个 proxy: 'http://localhost:4000' )
			'/api': {
				target: 'http://127.0.0.1:30086',
				ws: true, //是否跨域
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	},
	pluginOptions: { // 第三方插件配置
		// ...
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@assets': resolve('src/assets'),
				'@gisq': resolve('gisq'),
				'@lib': resolve('lib'),
				'@public': resolve('public'),
			}
		},
		// 代码压缩
		plugins: [
			/* new UglifyJsPlugin({
			uglifyOptions: {
			  //生产环境自动删除console
			  compress: {
				drop_debugger: true,
				drop_console: true,
				pure_funcs: ['console.log']
			  }
			},
			sourceMap: false,
			parallel: true
		  })*/
		],
		externals:{
		   /* 'vue':'Vue',
			//包名 ： 全局变量
		   'v-viewer':'v-viewer',
		   "viewerjs":"viewerjs", */
		}
	},
	chainWebpack(config) {
		if (IS_PROD) {
			/* config.optimization.splitChunks({
				cacheGroups: {
					common: {
						name: 'chunk-common', // 打包后的文件名
						chunks: 'initial', // 
						minChunks: 2,
						maxInitialRequests: 5,
						minSize: 0,
						priority: 1,
						reuseExistingChunk: true
					},
					vendors: {
						name: 'chunk-vendors',
						test: /[\\/]node_modules[\\/]/,
						chunks: 'initial',
						priority: 2,
						minSize: 0,
						reuseExistingChunk: true,
						enforce: true
					},
					ol: {
						name: 'chunk-ol',
						test: /[\\/]node_modules[\\/]ol[\\/]/,
						chunks: 'initial',
						priority: 3,
						minSize: 0,
						reuseExistingChunk: true,
						enforce: true
					},
					proj4: {
						name: 'chunk-proj4',
						test: /[\\/]node_modules[\\/]proj4[\\/]/,
						chunks: 'initial',
						priority: 3,
						minSize: 0,
						reuseExistingChunk: true,
						enforce: true
					},
					shpjs: {
						name: 'chunk-shpjs',
						test: /[\\/]node_modules[\\/]shpjs[\\/]/,
						chunks: 'initial',
						priority: 3,
						minSize: 0,
						reuseExistingChunk: true,
						enforce: true
					},
					mobileoffline: {
						name: 'chunk-mobileoffline',
						test: /[\\/]node_modules[\\/]gisq-ol-mobile-offline[\\/]/,
						chunks: 'initial',
						priority: 3,
						minSize: 0,
						reuseExistingChunk: true,
						enforce: true
					}
				}
			})*/
			
		}
		/* config.module
			.rule('js')
			.include
			.add('gisq/upload')
			.end()
			.use('babel')
			.loader('babel-loader')
			.tap(options => {
				// 修改它的选项...
				return options
			}) */
	}

}
