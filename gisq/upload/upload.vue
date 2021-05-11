<template>
	<div class="uploadRoot" style="">
		<div style="" class="zoomimages" v-viewer="zoomOptions">
			<div v-for="(item,key) in fileMap" style="" class="gisq-image-showsmall-div" @click="handleOpen(item[1],$event)" :ckey="fileMapStateTrack">
				<img :src="item[1].type=='picture'?item[1].src:item[1].poster" :key="item[0]" 
				class="gisq-small-image" ></img>
				<div style="" class="gisqUpload gisqUpload-delete-root-div" @click="showDelDialogAction(item[0],$event)"
					:cKey="item[0]">
					<span class="iconfont-gisqupload icon-shanchu gisqUpload-icon-delete-span" style="">

					</span>

				</div>
				<div style="" class="gisq-upload-video-icon" v-show="item[1].type==='video'">
					<i class="iconfont-gisqupload icon-circle-video" style="font-size: 2rem;color: #FFFFFF;"></i>
				</div>
			</div>
			<div style="" @click="showSheet" class="gisqupload-div-action-plus">
				<span class="iconfont-gisqupload icon-plus-line" ></span>
			</div>
		</div>

		<div class="gisqUploadActionSheet">
			<gisqSheet :p_visiable.sync="iShow" :p_title="iTitle" :p_sheetItems="sheetItems"
				@clickOnSheet="clickOnSheet" />
		</div>
		<!-- <duo-image-viewer :src="bigSrc" @close="handleClose" :srcList="srcList" :showViewer="showViewer" /> -->
		<!-- <viewer class="viewer " style="width: 80px;" alt="">
		  <img :src="bigSrc">
		</viewer> -->
		<div class='popContainer' v-show="showMaskDialog">
			<video style="" class="gisqlib-upload-video" controls="controls" ref="gisqLibUploadVideoPlayer"
				@ended="onPlayerEnded($event)">
				<source :src="gisqVideoUrl" type="video/mp4">
			</video>
			<div class="gisqlib-upload-videomask-close-div" @click="closePlayVideoMask()">
				<i class="iconfont-gisqupload icon-close gisqlib-upload-videomask-closeIcon"></i>
			</div>

		</div>
		<input hidden="hidden" type="file" multiple="multiple" accept="image/*,video/*" ref="gisqLibUploadInputFileH5"/>
		<dialog-bar v-model="showDelDialog" type="danger" title="警告!" content="确定删除图片?" v-on:cancel="clickCancel()" @danger="clickDanger()" @confirm="clickConfirm()" dangerText="删除"></dialog-bar>
	</div>
</template>

<script>
	import 'viewerjs/dist/viewer.css'
	import gisqSheet from "./sheet.vue"
	//import duoImageViewer from "./photoView/src/index.vue"
	import Viewer from 'v-viewer'
	import Vue from 'vue'
	import dialogBar from './dialog.vue'

	Vue.use(Viewer)


	//Viewer.setDefaults( {Options:{ "inline": true, "button": true, "navbar": true, "title": true, "toolbar": false, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" } })

	export default {
		name: "gisqUpload",
		components: {
			gisqSheet,dialogBar
			//duoImageViewer
		},
		props:{
			files:Array,
			onBeforeDeleted:Function,
			onBeforeAdded:Function,
			onDeleted:Function,
			onAdded:Function,
		},
		watch:{
			files:{
				deep:true,
				immediate:true,
				handler(newVal,oldVal){
					if(!this.files) return;
					for(var i=0;i<this.files.length;i++){
						var fileType=this.getFileType(this.files[i]);
						var path=this.files[i];
						if(fileType=="video"){
							var _self=this;
							this.getVideoBase64(path).then(function(dataUrl){
								_self.updateFileMap(path,path,fileType,dataUrl,"show");
							})
						}else{
							this.updateFileMap(path,path,fileType,"","show");
						}
						
					}
					
				}
			}
		},
		data() {
			return {
				delKey:"",
				showDelDialog:false,
				fileMapStateTrack:0,
				gisqVideoUrl: "",
				showMaskDialog: false,
				videoHeight:240,
				videoWidth:400,
				isHbuilder: false,
				currentValue: false,
				iTitle: "类型选择",
				iLeft: "取消",
				iShow: false,
				sheetItems: [{
						id: 1,
						name: "拍照",
					}, {
						id: 2,
						name: "选取图片",
					},

				],
				addedFileMap:new Map(),
				fileMap: new Map(),
				index: 0,
				showViewer: false,
				bigSrc: "",
				srcList: [],
				zoomOptions: {
					inline: false,
					button: true,
					navbar: false, //去除左右滑动切换
					title: false,
					toolbar: {
						zoomIn: 0,
						zoomOut: 0,
						oneToOne: 0,
						reset: 0,
						prev: 0,
						play: 0,
						next: 0,
						rotateLeft: 0,
						rotateRight: 0,
						flipHorizontal: 0,
						flipVertical: 0
					},
					tooltip: false,
					movable: true,
					zoomable: true,
					rotatable: true,
					scalable: true,
					transition: false,
					fullscreen: true,
					keyboard: true,
				}
			}
		},
		methods: {
			clickCancel:function(){
				console.log('点击了取消');
				this.delKey="";
			},
			clickDanger:function(){
				console.log('这里是danger回调')
				this.deleteSelectedFile(this.delKey);
				this.delKey="";
			},
			clickConfirm:function(){
				console.log('点击了confirm');
			},
			getFileType:function(path){
				var fileType = "picture";
				if(!!path){
					
					var types = path.split(".")
					
					if (types.length >= 2) {
						var type = types[types.length - 1].toLowerCase();
						if (type === "mp4" || type === "mov" || type === "avi" || type === "wmv" || type === "3gp" ||
							type === "mkv" || type === "rmvb" || type === "webm" || type === "flv" || type === "qsv") {
							fileType = "video";
						}
						
					}
				}
				return fileType;
				
			},
			showSheet: function() {
				this.iShow = true;
			},
			clickOnSheet: function(obj) {
				if(this.isHbuilder==true){
					try{
						var cameraActivity = plus.android.importClass(
							"com.zjzs.gisq.jetpack.aar_camara.CamaraActivity");
							if (obj.id == 1) {
								this.takePhoto();
								
							} else {
								this.choosePhoto();
							}
							
					}catch(e){
						//to call H5's takePhoto
						if (obj.id == 1) {
							this.takePhotoH5();
							
						} else {
							this.choosePhotoH5();
						}
					}
				}else{
					//to call H5's takePhoto
					if (obj.id == 1) {
						this.takePhotoH5();
						
					} else {
						this.choosePhotoH5();
					}
				}
				
			},
			takePhotoH5:function(){
				var h5FileEl=this.$refs.gisqLibUploadInputFileH5;
				var _self=this;
				h5FileEl.onchange=function(e){
					_self.handleH5InputChange(this.files);
				}
				h5FileEl.click();
			},
			choosePhotoH5:function(){
				var _self=this;
				var h5FileEl=this.$refs.gisqLibUploadInputFileH5;
				h5FileEl.onchange=function(e){
					_self.handleH5InputChange(this.files);
				}
				h5FileEl.click();
			},
			handleH5InputChange:function(files){
				if(!!files){
					console.log(files)
					for(var i=0;i<files.length;i++){
						this.readH5File(files[i]);
					}
				}
			},
			readH5File:function(file){
				var jsBlob = URL.createObjectURL(file);
				var fileType=this.getFileType(file.name);
				var _self=this;
				if(fileType==="video"){
					_self.getVideoBase64(jsBlob).then(function(dataUrl){
						_self.updateFileMap(file.name,jsBlob,fileType,dataUrl,"add",file);
					});
				}else{
					_self.updateFileMap(file.name,jsBlob,fileType,"","add",file);
				}
			},
			takePhoto: function() {
				var _self = this;
				if (_self.isHbuilder==true) {
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass("android.content.Intent");
					var cameraActivity = plus.android.importClass(
						"com.zjzs.gisq.jetpack.aar_camara.CamaraActivity"); //自己写的二维码扫描页面
					var intent = new Intent(main, cameraActivity.class);
					//intent.setClassName(main, cameraActivity.class);

					main.onActivityResult = function(requestCode, resultCode, data) {
						if (100 == requestCode) {
							plus.android.importClass(data);
							var bundle = data.getExtras();
							plus.android.importClass(bundle);
							var addphoto = bundle.getString("addphoto"); ///获取新拍
							//alert("addphoto=" + addphoto);
							var jsonPaths = JSON.parse(addphoto)
							for (var idx in jsonPaths) {
								//alert("sss==="+jsonPaths[idx].path);
								_self.parseFile("file://" + jsonPaths[idx].path)
							}
						}
					};
					main.startActivityForResult(intent, 100);
				}
			},
			choosePhoto: function() {
				var _self = this;
				
				/* var pSrc="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.virtualtelescope.eu%2Fwordpress%2Fwp-content%2Fuploads%2F2018%2F11%2F2018-11-11-Moon-Saturn_Barnaba.jpg&refer=http%3A%2F%2Fwww.virtualtelescope.eu&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619860628&t=52e2ee9f5825302530acdc86003deff3"
				_self.updateFileMap(_self.index+"",pSrc,"picture","","add");
				var vSrc="https://wts.itqiche.com/u5/car_u5_video/XuHang.mp4";
				this.getVideoBase64(vSrc).then(function(dataUrl){
					_self.updateFileMap((_self.index+1)+"",vSrc,"video",dataUrl,"add");
				})
				_self.index++; */


				if (_self.isHbuilder==true) {
					// 从相册中选择图片
					console.log("从相册中选择多张图片:");
					plus.gallery.pick(function(e) {
						for (var i in e.files) {
							//alert("sss===" + e.files[i]);
							_self.parseFile(e.files[i])
						}
					}, function(e) {
						console.log("取消选择图片");
					}, {
						filter: "none",
						multiple: true,
						maximum: 4,
						system: false,
						onmaxed: function() {
							plus.nativeUI.alert('最多只能选择4张图片');
						}
					});
				}

			},
			dataURLtoFile: function(dataurl, filename) { //将base64转换为文件
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, {
					type: mime
				});
			},
			parseFile: function(path) {
				var _self = this;
				if (_self.isHbuilder==true) {
					if(!!path){
						var types = path.split(".")
						var fileType = "picture";
						fileType=_self.getFileType(path);
						if (path.indexOf("http") >= 0) {
							
							if(fileType === "video"){
								this.getVideoBase64(path).then(function(dataURL){
									console.log(111)
									_self.updateFileMap(path,path,fileType,dataUrl,"add");
								})
							}else{
								_self.updateFileMap(path,path,fileType,"","add");
							}
							return;
						}else{
							_self.readLocalFile(path,fileType);
						}
							
					}
					
				}
			},
			readFile: function(path,fileType, entry) {
				var _self = this;
				if (_self.isHbuilder==true && (!!path)) {
					var fileReader = new plus.io.FileReader();
					fileReader.onloadend = function(evt) {
						var url = evt.target.result;
						var fileJs = _self.dataURLtoFile(url, entry.name); //转换为js 的file对象 
						var jsBlob = URL.createObjectURL(fileJs);
						if(fileType==="video"){
							_self.getVideoBase64(jsBlob).then(function(dataUrl){
								_self.updateFileMap(path,jsBlob,fileType,dataUrl,"add",fileJs);
							});
						}else{
							_self.updateFileMap(path,jsBlob,fileType,"","add",fileJs);
						}
					}
					fileReader.readAsDataURL(entry);
				}

			},
			readLocalFile:function(path,fileType){
				var _self=this;
				plus.io.resolveLocalFileSystemURL(path, function(entry) {
					// 可通过entry对象操作test.html文件 
					_self.readFile(path, fileType,entry);
				}, function(e) {
					alert("Resolve file URL failed: " + e.message);
				});
			},
			updateFileMap:function(path,jsBlob,fileType,posterDataUrl,actionType,jsFile){
				this.beforeAdded(path);
				var isServer=false;
				if(path.indexOf("http")==0){
					isServer=true;
				} 
				var fileObj={
					src: jsBlob,
					poster: posterDataUrl,
					type: fileType,
					actionType:actionType,
					isServer:isServer,
				}
				this.fileMap.set(path,fileObj );
				this.fileMapStateTrack++;
				console.log(this.fileMap)
				if(actionType==="add"){
					var addedObj=jsFile||jsBlob;
					this.addedFileMap.set(path,addedObj)
					this.addedFile(path);
					this.onChange();
				}
				this.$forceUpdate()
			},
			plusReady: function(callback) {
				if (window.plus) {
					callback();
				} else {
					document.addEventListener('plusready', callback);
				}
			},
			showDelDialogAction:function(key,e){
				this.showDelDialog=true;
				this.delKey=key;
				e.stopPropagation();
			},
			deleteSelectedFile: function(key) {
				this.$refs.gisqLibUploadInputFileH5.value="";
				var fileObj=this.fileMap.get(key);
				this.beforeDeleted(key);
				this.fileMap.delete(key)
				this.fileMapStateTrack--;
				this.$forceUpdate();
				
				this.addedFileMap.delete(key);
				this.deletedFile(key);
				this.onChange();
				event.stopPropagation();
			},
			beforeAdded:function(key){
				this.$emit("onBeforeAdded", key);
			},
			beforeDeleted:function(key){
				this.$emit("onBeforeDeleted", key);
			},
			deletedFile:function(key){
				this.$emit("onDeleted", key);
			},
			addedFile:function(key){
				this.$emit("onAdded", key,this.addedFileMap.get(key));
			},
			onChange: function() {
				this.$emit("onChange", this.addedFileMap);
			},
			handleOpen: function(item, event) {
				var src = item.src;
				var type = item.type;
				if (type === "video") {
					this.showMaskDialog = true;
					this.gisqVideoUrl = src;
					console.log(src)
					this.playVideo(this.$refs.gisqLibUploadVideoPlayer, src);
					event.stopPropagation();
					return;
				} else {
					this.bigSrc = src
					this.showViewer = !this.showViewer
					const viewer = this.$el.querySelector('.zoomimages').$viewer
					viewer.show()
				}

			},
			handleClose: function() {
				this.showViewer = false
			},
			/**
			 * 图片按宽高比例进行自动缩放
			 * @param ImgObj
			 *     缩放图片源对象
			 * @param maxWidth
			 *     允许缩放的最大宽度
			 * @param maxHeight
			 *     允许缩放的最大高度
			 * @usage 
			 *     调用：<img src="图片" οnlοad="javascript:DrawImage(this,100,100)">
			 */
			DrawBetterImage: function(ImgObj, maxWidth, maxHeight) {
				var image = new Image();
				//原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
				image.src = ImgObj.src;
				// 用于设定图片的宽度和高度
				var tempWidth;
				var tempHeight;

				if (image.width > 0 && image.height > 0) {
					//原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度
					console.log(1)
					if (image.width / image.height >= maxWidth / maxHeight) {
						console.log(2)
						if (image.width > maxWidth) {
							console.log(3)
							tempWidth = maxWidth;
							// 按原图片的比例进行缩放
							tempHeight = (image.height * maxWidth) / image.width;
						} else {
							console.log(4)
							// 按原图片的大小进行缩放
							tempWidth = image.width;
							tempHeight = image.height;
						}
					} else { // 原图片的高度必然 > 宽度
						console.log(5)
						if (image.height > maxHeight) {
							console.log(6)
							tempHeight = maxHeight;
							// 按原图片的比例进行缩放
							tempWidth = (image.width * maxHeight) / image.height;
						} else {
							console.log(7)
							// 按原图片的大小进行缩放
							tempWidth = image.width;
							tempHeight = image.height;
						}
					}
					// 设置页面图片的宽和高
					ImgObj.height = tempHeight;
					ImgObj.width = tempWidth;
					// 提示图片的原来大小
					ImgObj.alt = image.width + "×" + image.height;

				}
			},
			dbPlayVideo(url) {
				//进入全屏
				var obj = this.$refs.gisqLibUploadVideoPlayer;
				if (obj.requestFullscreen) {
					obj.requestFullscreen();
				} else if (obj.mozRequestFullScreen) {
					obj.mozRequestFullScreen();
				} else if (obj.webkitRequestFullScreen) {
					obj.webkitRequestFullScreen();
				}
				obj.play(url);
				obj.parentNode.childNodes[0].style.display = "none";
			},
			//退出全屏
			exitFullscreen(id) {
				var obj = this.$refs.gisqLibUploadVideoPlayer;
				if (document.exitFullscreen && obj.style.objectFit == "") {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
				obj.parentNode.childNodes[0].style.display = "block";
				setTimeout(function() {
					obj.style.objectFit = "fill";
				}, 500);
			},
			playVideo(obj, url) {
				obj.style.objectFit = "";
				var _this = this;
				obj.src = url;
				//视频横屏
				var phoneWidth = document.documentElement.clientWidth;
				var phoneHeight = document.documentElement.clientHeight;
				var scal=0.92;
				if(phoneHeight<phoneWidth){//横屏
					if(this.videoHeight>this.videoWidth){//高大于宽
						var r=this.videoWidth/this.videoHeight
						obj.style.height=phoneHeight*scal+"px";
						obj.style.width=phoneHeight*scal*r+"px";
					}else{
						var r=this.videoHeight/this.videoWidth
						obj.style.width=phoneWidth*scal+"px";
						obj.style.height=phoneWidth*scal*r+"px";
					}
				}else{
					if(this.videoHeight<this.videoWidth){//高大于宽
						var r=this.videoHeight/this.videoWidth
						obj.style.width=phoneWidth*scal+"px";
						obj.style.height=phoneWidth*scal*r+"px";
					}else{
						var r=this.videoWidth/this.videoHeight
						obj.style.height=phoneHeight*scal+"px";
						obj.style.width=phoneHeight*scal*r+"px";
					}
				}
				
				//this.dbPlayVideo(url);
				obj.play(url);

			},
			reSetVideo(eventType) {
				var obj = this.$refs.gisqLibUploadVideoPlayer;

				var isFull = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement ||
					document.webkitFullscreenElement || false;
				var url = this.gisqVideoUrl;
				if (obj && !isFull) {
					obj.pause();
					obj.src = url;
					obj.load();

					obj.currentTime = 0;
					obj.style.objectFit = "fill";
					obj.parentNode.childNodes[0].style.display = "block";
					obj.addEventListener(eventType, null);
					obj = null;
				}
			},
			maskEventDeal: function(event) {

				if (event.target != this.$refs.gisqLibUploadVideoPlayer) {
					event.stopPropagation();
				}
			},
			closePlayVideoMask: function() {
				this.showMaskDialog = false;
				this.gisqVideoUrl = "";
				this.$refs.gisqLibUploadVideoPlayer.pause();
			},
			onPlayerEnded: function(event) {

			},
			getVideoBase64: function(url) {
				var _self=this;
				return new Promise(function(resolve, reject) {
					let dataURL = '';
					let video = document.createElement("video");
					video.setAttribute('crossOrigin', 'anonymous'); //处理跨域
					video.setAttribute('src', url);
					video.setAttribute('width', 400);
					video.setAttribute('height',240);
					video.currentTime = 2
					video.addEventListener('loadeddata', function() {
						console.log(11111)
						let canvas = document.createElement("canvas");
						let width = video.width; //canvas的尺寸和图片一样
						let height = video.height;
						_self.videoWidth=this.videoWidth;
						_self.videoHeight=this.videoHeight;
						var cContext=canvas.getContext("2d");
						cContext.fillStyle = "#fff";
						canvas.width = width;
						canvas.height = height;
						cContext.fillRect(0, 0, canvas.width, canvas.height);
						cContext.drawImage(video, 0, 0, width, height); //绘制canvas
						dataURL = canvas.toDataURL('image/jpeg'); //转换为base64
						video.currentTime = 0
						resolve(dataURL);
					});
				})
			}
		},
		mounted() {
			var _self = this;
			this.plusReady(function() {
				_self.isHbuilder = true;
			});

		},
		created() {
			//alert(1)
		},

	}
</script>

<style>
	@import url("../../src/assets/css/iconfont.css");



	div.popContainer {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 999;
		padding: 16px;
	}

	.gisqlib-upload-videomask-close-div {
		position: absolute;
		top: -40px;
		right: -40px;
		width: 80px;
		height: 80px;
		border-radius: 40px;
		background-color: #00002250;
	}

	.gisqlib-upload-videomask-close-div:active {

		background-color: #000000;
	}

	.gisqlib-upload-videomask-closeIcon {
		position: absolute;
		bottom: 10%;
		left: 30%;
		transform: translate(-50%, -50%);
		color: #FFFFFF;
	}

	.gisqlib-upload-video {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 80%;
		height: 80%;
		object-fit: fill;
		transform: translate(-50%, -50%);
	}

	.gisq-upload-video-icon {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.gisq-image-showsmall-div {
		float: left;
		border: 1px;
		padding: 2px;
		margin-right: 2px;
		position: relative;
		overflow: hidden;
	}

	.gisqUploadActionSheet {
		text-align: center;
	}

	.gisqUpload-delete-root-div {
		position: absolute;
		width: 50px;
		height: 50px;
		background-color: red;
		top: -25px;
		right: -25px;
		z-index: 999;
		transform: rotate(45deg);
	}

	.gisqUpload-icon-delete-span {
		position: absolute;
		left: 50%;
		bottom: 0;
		transform: translate(-50%, -0%);
	}

	.gisqupload-div-action-plus {
		float: left;
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		border: 1px dashed #CFCFCF;
		margin-right: 2px;
	}

	.gisq-small-image {
		text-align: center;
		width: 80px;
		height: 80px;
		object-fit: contain;
	}
</style>
