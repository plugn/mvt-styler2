<template>
	<div class="map" id="map-container"></div>
</template>

<script>
	import {eventBus} from '../../main';

	import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
	mapboxgl.accessToken = 'pk.eyJ1IjoicGx1Z24iLCJhIjoiY2l6cHIyejhzMDAyODJxdXEzaHM2cmVrZiJ9.qLg-Ki18d0JQnAMfzg7nCA';

	let map;
	export default {
		components: {
		},

		data() {
			return {}
		},

		created() {

		},

		mounted() {
			this.initMap();

			eventBus.$on('map:style.set', (value) => {
				console.log('$on map:style.set');
				map.setStyle(value);
			});
		},

		methods: {
			initMap() {
				console.log('initMap()', this.$el);
				map = new mapboxgl.Map({
					container: this.$el,
					// style: 'mapbox://styles/mapbox/streets-v9'
				});
				
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