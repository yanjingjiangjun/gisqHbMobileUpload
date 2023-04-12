<template>
	<div id="app">
		<gisq-upload @onChange="onChange" 
		@onAdded="onAdded" 
		@onBeforeAdded="onBeforeAdded" 
		@onBeforeDeleted="onBeforeDeleted" 
		@onDeleted="onDeletedX" 
		v-bind:files.sync="showFiles" 
		v-bind:extraInfo="extraInfo"></gisq-upload>
		<span  @click="testGetInfo">测试</span>
		<img :src="testSrc"/>
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
				test1:"aaa",
				test2:"",
				test3:{"name":"test3"},
				test4:null,
				testSrc:null,
				files:[],
				//showFiles:[],
				 showFiles:[
				"file://video/1.png",
				"file://video/2.png",
				] ,
				extraInfo:""
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
					console.log(key)
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
			testGetInfo(){
				this.extraInfo=this.getCurrentTime() ;
				console.log(gisqUpload)
				gisqUpload.getDeviceInfo(function(info){
					console.log(JSON.stringify(info))
				})
				var _this=this;
				var path="file:///sdcard/gisqmap/161776021489153.jpeg";
				gisqUpload.readLocalFile(path,function(fileJs,jsBlob){
					_this.testSrc=jsBlob;
				});
			},
			getCurrentTime() {
			    var date = new Date();//当前时间
			    var year = date.getFullYear() //返回指定日期的年份
			    var month = this.repair(date.getMonth() + 1);//月
			    var day = this.repair(date.getDate());//日
			    var hour = this.repair(date.getHours());//时
			    var minute = this.repair(date.getMinutes());//分
			    var second = this.repair(date.getSeconds());//秒
			    
			    //当前时间 
			    var curTime = year + "-" + month + "-" + day
			            + " " + hour + ":" + minute + ":" + second;
			    return curTime;
			},
			 
			//补0
			 
			repair(i){
			    if (i >= 0 && i <= 9) {
			        return "0" + i;
			    } else {
			        return i;
			    }
			}
		},
		mounted() {
			
			this.test4=this.test3;
			this.test4.name="test444";
			console.log(JSON.stringify(this.test3)+","+JSON.stringify(this.test4))
		},
		 
		
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
