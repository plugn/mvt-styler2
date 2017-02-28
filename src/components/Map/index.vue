<template>
	<div class="map" id="map-container"></div>
</template>

<script>
	import {eventBus} from '../../main';

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
			eventBus.$on('map:style.set', (value) => {
				console.log('$on map:style.set');
				if (map) {

				    console.log('map.getStyle()', map.getStyle());
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
				console.log('initMap()', this.$el);
				map = new mapboxgl.Map({
					container: this.$el,
				});
				if (_initialStyle) {
				    map.setStyle(_initialStyle);
				    _initialStyle = undefined;
				}
//window.map = map;
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
