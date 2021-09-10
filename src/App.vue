<template>
	<div id="app">
		<gisq-upload @onChange="onChange" @onAdded="onAdded" @onBeforeAdded="onBeforeAdded" @onBeforeDeleted="onBeforeDeleted" @onDeleted="onDeletedX" v-bind:files.sync="showFiles" ></gisq-upload>
		<a href="http://127.0.0.1:30044/GisQMobileRest/api/report/export?type=all">测试</a>
		<router-view></router-view>
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
				files:[],
				//showFiles:[],
				 showFiles:[
				"video/1.mp4",
				"video/2.mp4",
				] 
			}
		},
		methods: {
			onCustomPrewer:function(src){
				console.log(1111111333);
			},
			onChange:function(fileMap){
				console.log("onChange")
				for(let key of fileMap.keys()){
					//alert("dddd="+fileMap.get(key).lastModifiedDate)
				}
			},
			onAdded:function(path,fileObj){
				console.log("onAdded="+path)
				console.log(fileObj)
				this.files.push(fileObj);
			},
			onDeletedX:function(path){
				console.log("onDeleted")
				console.log(path)
				this.onDeleted(path,this.files)
			},
			onDeleted:function(path,fileList){
				console.log("onDeleted")
				console.log(path)
				fileList.forEach((item,index)=>{
					if(item.name==path){
						let index = fileList.indexOf(item)
						fileList.splice(index,1)
					}
				})
				console.log(this.files)
			},
			onBeforeAdded:function(path){
				console.log("onBeforeAdded")
				console.log(path)
			},
			onBeforeDeleted:function(path){
				console.log("onBeforeDeleted")
				console.log(path)
			},
			toTakePic:function(){
				 //this.$router.replace({path:'/takePic',name:"takePic"});  
				 //this.$router.push('/takePic')
				 this.showFiles=[];
				 //this.$forceUpdate()
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
