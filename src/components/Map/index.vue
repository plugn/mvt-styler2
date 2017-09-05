<template>
	<div class="map" id="map-container"></div>
</template>

<script>

	import {eventBus} from '../../main'
	import {updateMapLayer, prettifyMapLayer} from '../../util/styleSync'

	import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
	import * as types from '../../store/mutation-types'
	import {mapState, mapMutations} from 'vuex'
	import {forOwn} from 'lodash'

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
			return {
				style: null
			}
		},

		created() {
			// TODO: refactor to utility function
			eventBus.$on('map:layer.update', function(layerId, values, newStyle) {
//				console.log('map:layer.update', layerId, values);

				let {cmd, unhandledParams} = updateMapLayer(layerId, values, map);
				console.log('not applied with update:', JSON.stringify(unhandledParams));
				if (Object.keys(unhandledParams).length) {
					this.applyStyle(newStyle);
//					map.setStyle(newStyle);
				}
				else {
					forOwn(cmd, function (fn) {
						console.log(' * fn : ', fn.toString());
						fn.call();
					});
				}
			});

			eventBus.$on('map:resize', function () {
				console.log('@map:resize');
				if (map) {
					map.resize();
				}
			});

			eventBus.$on('map:style.set', this.applyStyle);

		},

		mounted() {
			this.initMap();
		},

		methods: {
			...mapMutations({
				setMapPopup: types.SET_MAP_POPUP
			}),

			applyStyle (value) {
//				console.log('$on map:style.set');
				if (!map) {
					_initialStyle = value;
					return;
				}
// TODO : smart setting style with map hot update in mind
				if (value !== this.style) {
					map.setStyle(value);
					this.style = value;
				} else {
					console.log('map:style.set ignored because of identical');
				}
			},
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
