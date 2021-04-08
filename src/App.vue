<template>
	<div id="app">
		<!-- <popup v-model="currentValue">
			<div class="addresTitle">
				<span @click="currentValue = false">取消</span>
				<span @click="onConfirm">确定</span>
				<p>所在地区</p>

			</div>
		</popup> -->
		<gisq-upload @onChange="onChange" ></gisq-upload>
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
				
			}
		},
		methods: {
			onChange:function(fileMap){
				console.log(fileMap)
			}
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
