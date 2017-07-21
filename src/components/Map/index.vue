<template>
	<div class="map" id="map-container"></div>
</template>

<script>

	import {eventBus} from '../../main';
	import {updateMapLayer, prettifyMapLayer} from '../LayerList/styleSync'

	import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
	mapboxgl.accessToken = 'pk.eyJ1IjoicGx1Z24iLCJhIjoiY2l6cHIyejhzMDAyODJxdXEzaHM2cmVrZiJ9.qLg-Ki18d0JQnAMfzg7nCA';

	let map,
		_initialStyle;

	export default {
		components: {
		},

		data() {
			return {}
		},

		created() {
			// TODO: refactor to utility function
			eventBus.$on('map:layer.update', function(layerId, values) {
				let unhandledParams = updateMapLayer(layerId, values, map);
console.log('not applied with update:', unhandledParams);
				let layerCode = prettifyMapLayer(map.getLayer(layerId));
console.log('map.getLayer('+layerId+') :', layerCode);
			});

			eventBus.$on('map:resize', function () {
				console.log('@map:resize');
				if (map) {
					map.resize();
				}
			});

			eventBus.$on('map:style.set', function (value) {
				console.log('$on map:style.set');
				if (map) {
				    console.log('map.getStyle()');
					map.setStyle(value);
				}
				else {
					_initialStyle = value;
				}
			});

		},

		mounted() {
			this.initMap();
		},

		methods: {
			initMap() {
				map = new mapboxgl.Map({
					container: this.$el,
					center: [37, 55],
					zoom: 5
				});

				let nav = new mapboxgl.NavigationControl();
				map.addControl(nav, 'top-left');

				if (_initialStyle) {
				    map.setStyle(_initialStyle);
				    _initialStyle = undefined;
				}

			}
		}
	}

</script>
<style src="mapbox-gl/dist/mapbox-gl.css"></style>

<style>
	.map {
		height: 100%;
		background-color: ghostwhite;
	}
</style>
