<template>
	<div class="map" id="map-container"></div>
</template>

<script>

	import {eventBus} from '../../main'
	import {updateMapLayer, prettifyMapLayer} from '../../util/styleSync'

	import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
	import * as types from '../../store/mutation-types'
	import {mapState, mapMutations} from 'vuex'

	mapboxgl.accessToken = 'pk.eyJ1IjoicGx1Z24iLCJhIjoiY2l6cHIyejhzMDAyODJxdXEzaHM2cmVrZiJ9.qLg-Ki18d0JQnAMfzg7nCA';

	let map,
		_initialStyle;

	export default {
		computed:{
			...mapState({
				popupFeatures: state => state.mapPopup.features,
			})
		},

		data() {
			return {}
		},

		created() {
			// TODO: refactor to utility function
			eventBus.$on('map:layer.update', function(layerId, values) {
//				console.log('map:layer.update', layerId, values);

				let unhandledParams = updateMapLayer(layerId, values, map);
				console.log('not applied with update:', unhandledParams);
			});

			eventBus.$on('map:resize', function () {
				console.log('@map:resize');
				if (map) {
					map.resize();
				}
			});

			eventBus.$on('map:style.set', function (value) {
//				console.log('$on map:style.set');
				if (map) {
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
			...mapMutations({
				setMapPopup: types.SET_MAP_POPUP
			}),
			initMap() {
				const vm = this;
				map = new mapboxgl.Map({
					container: this.$el,
					center: [37, 55],
					zoom: 5,
					hash: true // display current zoom and coordinates as a part of URL
				});

				if (_initialStyle) {
				    map.setStyle(_initialStyle);
				    _initialStyle = undefined;
				}

				let nav = new mapboxgl.NavigationControl();
				map.addControl(nav, 'top-left');

				function onInteraction(e) {
					if (vm.popupFeatures && vm.popupFeatures.length) {
						vm.setMapPopup({features:[]});
					}
				}

				'dragstart zoomstart resize'.split(' ').forEach(function(event){
					map.on(event, onInteraction);
				})

				map.on('click', function (e) {
					if (vm.popupFeatures && vm.popupFeatures.length) {
						return onInteraction(e);
					}
					let features = map.queryRenderedFeatures(e.point, {});
					vm.setMapPopup({features, point: e.point});
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
	/*
	#map-container canvas {
		cursor: auto;
	}
	*/
</style>
