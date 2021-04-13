<template>
	<div class='popContainer' v-show="showMaskDialog">
		<video style="" class="gisqlib-upload-video" controls="controls" ref="gisqLibUploadVideoPlayer"
			@ended="onPlayerEnded($event)">
			<source :src="gisqVideoUrl" type="video/mp4">
		</video>
		<div class="gisqlib-upload-videomask-close-div" @click="closePlayVideoMask()">
			<i class="iconfont-gisqupload icon-close gisqlib-upload-videomask-closeIcon"></i>
		</div>
	
	</div>
</template>

<script>
</script>

<style>
</style>
