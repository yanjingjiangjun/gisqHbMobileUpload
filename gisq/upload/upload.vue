<template>
	<div class="uploadRoot" style="">
		<div style="" class="zoomimages" v-viewer="zoomOptions">
			<div v-for="(item,key) in fileMap" style="" class="gisq-image-showsmall-div">
				<img :src="item[1]" :key="item[0]" class="gisq-small-image"
					@click="handleOpen(item[1],$event.target)" @load="DrawBetterImage($event.target,100,100)"></img>
				<div style="" class="gisqUpload gisqUpload-delete-root-div" @click="deleteSelectedFile(item[0])"
					:cKey="item[0]">
					<span class="iconfont-gisqupload icon-shanchu gisqUpload-icon-delete-span" style="">

					</span>

				</div>
			</div>
			<div style="" @click="showSheet" class="gisqupload-div-action-plus">
				<span class="iconfont-gisqupload icon-plus-line" style="font-size: 2rem;"></span>
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
	</div>
</template>

<script>
	import 'viewerjs/dist/viewer.css'
	import gisqSheet from "./sheet.vue"
	//import duoImageViewer from "./photoView/src/index.vue"
	import Viewer from 'v-viewer'
	import Vue from 'vue'
	Vue.use(Viewer)


	//Viewer.setDefaults( {Options:{ "inline": true, "button": true, "navbar": true, "title": true, "toolbar": false, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" } })

	export default {
		name: "gisqUpload",
		components: {
			gisqSheet,
			//duoImageViewer
		},
		data() {
			return {
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
				fileMap: new Map(),
				index: 0,
				showViewer: false,
				bigSrc: "",
				srcList: [],
				zoomOptions: {
					inline: false,
					button: true,
					navbar: true,
					title: true,
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
					tooltip: true,
					movable: true,
					zoomable: true,
					rotatable: true,
					scalable: true,
					transition: true,
					fullscreen: true,
					keyboard: true,
				}
			}
		},
		methods: {
			showSheet: function() {
				this.iShow = true;
			},
			clickOnSheet: function(obj) {
				if (obj.id == 1) {
					this.takePhoto();
				} else {
					this.choosePhoto();
				}
			},
			takePhoto: function() {
				var _self = this;
				if (_self.isHbuilder) {
					var gisqCamera = plus.android.importClass('com.zjzs.gisq.qcjg.lib.GisqCamera');
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
				/* _self.fileMap.set(_self.index,
					"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.virtualtelescope.eu%2Fwordpress%2Fwp-content%2Fuploads%2F2018%2F11%2F2018-11-11-Moon-Saturn_Barnaba.jpg&refer=http%3A%2F%2Fwww.virtualtelescope.eu&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619860628&t=52e2ee9f5825302530acdc86003deff3"
					)
				_self.index++; */
				/* setTimeout(function(){
					
					
				},1000) */

				if (_self.isHbuilder) {
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
						filter: "image",
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
				if (_self.isHbuilder) {
					plus.io.resolveLocalFileSystemURL(path, function(entry) {
						// 可通过entry对象操作test.html文件 
						var fileReader = new plus.io.FileReader();

						fileReader.onloadend = function(evt) {
							var url = evt.target.result;
							var fileJs = _self.dataURLtoFile(url, entry.name); //转换为js 的file对象 
							var jsBlob = URL.createObjectURL(fileJs);
							//_self.fileMap2.push({"key":""+path+"","value":""+jsBlob+""})
							_self.fileMap.set(path, jsBlob);
							//
							//_self.fileMap2.put(path,jsBlob);
							_self.$forceUpdate()
						}
						fileReader.readAsDataURL(entry);
					}, function(e) {
						alert("Resolve file URL failed: " + e.message);
					});
				}
			},
			plusReady: function(callback) {
				if (window.plus) {
					callback();
				} else {
					document.addEventListener('plusready', callback);
				}
			},
			deleteSelectedFile: function(key) {
				this.fileMap.delete(key)
				this.$forceUpdate();
				this.onChange();
			},
			onChange: function() {
				this.$emit("onChange", this.fileMap);
			},
			handleOpen: function(src, domElement) {
				this.bigSrc = src
				this.showViewer = !this.showViewer
				const viewer = this.$el.querySelector('.zoomimages').$viewer
				viewer.show()
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
					if (image.width / image.height >= maxWidth / maxHeight) {
						if (image.width > maxWidth) {
							tempWidth = maxWidth;
							// 按原图片的比例进行缩放
							tempHeight = (image.height * maxWidth) / image.width;
						} else {
							// 按原图片的大小进行缩放
							tempWidth = image.width;
							tempHeight = image.height;
						}
					} else { // 原图片的高度必然 > 宽度
						if (image.height > maxHeight) {
							tempHeight = maxHeight;
							// 按原图片的比例进行缩放
							tempWidth = (image.width * maxHeight) / image.height;
						} else {
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
		width: 3rem;
		height: 3rem;
		background-color: red;
		top: -1.5rem;
		right: -1.5rem;
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
		width: 5rem;
		height: 5rem;
		line-height: 5rem;
		text-align: center;
		border: 0.0625rem dashed #CFCFCF;
		margin-right: 0.125rem;
	}
	.gisq-small-image{
		text-align: center;
		width: 5rem;
		height: 5rem;
	}
</style>
