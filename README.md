# default

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
###dependencies
```
"v-viewer": "^1.5.1",
"viewerjs": "^1.9.0"
```
###0.3.0 变更
```
支持选择视频和拍摄视频
```
###0.3.1 变更
```
删除和新增图片钩子函数
```
###0.5.0
```
支持v-bind:files.sync="showFiles" 刷新组件数据
支持删除提示

```
###0.5.1
```
支持 自定义预览

```

###0.5.2
```
重写多视频回显 

```
### 

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### publish
```
npm publish --registry http://registry.npmjs.org

````
### 小demo
```

<template>
	<div id="app">
		<gisq-upload @onChange="onChange" @onAdded="onAdded" @onBeforeAdded="onBeforeAdded" @onBeforeDeleted="onBeforeDeleted" @onDeleted="onDeleted" v-bind:files.sync="showFiles" ></gisq-upload>
	</div>

</template>

<script>
	import gisqUpload from "../gisq/upload/upload.vue"
	export default {
		name: 'app',
		components: {
			gisqUpload
		},
		data() {
			return {
				//showFiles:[],
				 showFiles:["https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.virtualtelescope.eu%2Fwordpress%2Fwp-content%2Fuploads%2F2018%2F11%2F2018-11-11-Moon-Saturn_Barnaba.jpg&refer=http%3A%2F%2Fwww.virtualtelescope.eu&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619860628&t=52e2ee9f5825302530acdc86003deff3"
				,
				"https://wts.itqiche.com/u5/car_u5_video/XuHang.mp4",
				] 
			}
		},
		methods: {
			onChange:function(fileMap){
				console.log("onChange")
				for(let key of fileMap.keys()){
					//alert("dddd="+fileMap.get(key).lastModifiedDate)
				}
			},
			onAdded:function(path,fileObj){
				console.log("onAdded="+path)
				console.log(fileObj)
			},
			onDeleted:function(path){
				console.log("onDeleted")
				console.log(path)
			},
			onBeforeAdded:function(path){
				console.log("onBeforeAdded")
				console.log(path)
			},
			onBeforeDeleted:function(path){
				console.log("onBeforeDeleted")
				console.log(path)
			},
		}
	}
</script>

<style>
	* {
		padding: 0;
		margin: 0;
	}

	html,
	body {
		height: 100%;
	}

	#app {
		height: 100%;
	}

	.map {
		width: 100%;
		height: 100%;
	}
	.gisqupload-div-action-plus{
	}
</style>



```