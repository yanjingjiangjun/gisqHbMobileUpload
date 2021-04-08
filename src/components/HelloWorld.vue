<template>
	<div id="map" ref="map" class="map"></div>
</template>

<script>
	import 'ol/ol.css';
	import {
		transform
	} from 'ol/proj'
	import OlMap from 'ol/Map'
	import OSM from 'ol/source/OSM'
	import vectorSource from 'ol/source/Vector'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import GeoJSON from 'ol/format/GeoJSON'
	import View from 'ol/View';
	import shpjs from 'shpjs';
	import {
		gisqOlMobileProj,
		GisqOfflineShpLayer,
		GisqOfflineMbTilesLayer,
		gisqOlMobileStyle,
		GisqOfflineGeoJsonLayer
	} from "../../gisq/gisqOlMobile.js"
	export default {
		name: 'HelloWorld',
		components: {

		},
		data() {
			return {

			}
		},
		mounted() {

			var plusReady = function(callback) {
				if (window.plus) {
					alert(1);
					callback();
				} else {
					document.addEventListener('plusready', callback);
				}
			};
			plusReady(this.initMap)
			this.initMap();
		},
		methods: {
			initMap() {
				var localMbTilesPath = "/sdcard/gisqmap/cr.mbtiles";
				var localShpPath = "/sdcard/gisqmap/shp/xzc";
				var gisqShpLayer = new GisqOfflineShpLayer({
					path: localShpPath,
					featureName: "XZQ",
					projection: gisqOlMobileProj.proj4528.proj,
				});
				var mblayers = new GisqOfflineMbTilesLayer({
					path: localMbTilesPath,
					projection: gisqOlMobileProj.proj3857.proj,
					
				});
				var geoJsonTile=new GisqOfflineGeoJsonLayer({
									path: localShpPath,
									dataProjection: gisqOlMobileProj.proj3857.proj,
									featureProjection: gisqOlMobileProj.proj3857.proj,
				});
				var map = new OlMap({
					target: 'map',
					layers: [
						new TileLayer({
					source: new OSM()
				}),mblayers.getLayer(), geoJsonTile.getVectorTileLayer()],
					view: new View({
						center: transform([120, 30], 'EPSG:4326', 'EPSG:3857'),
						zoom: 9,
						minZoom: 1,
						maxZoom: 15
					})
				});
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	.map {
		width: 100%;
		height: 100%;
	}
</style>
