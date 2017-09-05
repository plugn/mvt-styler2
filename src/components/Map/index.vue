<template>
	<div class="map" id="map-container"></div>
</template>

<script>

	import {eventBus} from '../../main'
	import {updateMapLayer, prettifyMapLayer} from '../../util/styleSync'

	import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
	import * as types from '../../store/mutation-types'
	import {mapState, mapMutations, mapGetters} from 'vuex'
	import {forOwn, isEqual, isEqualWith, difference} from 'lodash'

	mapboxgl.accessToken = 'pk.eyJ1IjoicGx1Z24iLCJhIjoiY2l6cHIyejhzMDAyODJxdXEzaHM2cmVrZiJ9.qLg-Ki18d0JQnAMfzg7nCA';

	let map,
		_initialStyle;

	export default {
		data() {
			return {map:map};
		},
		computed:{
			...mapState([
				'vStyle'
			]),

			...mapGetters([
				'getPopupFeatures'
			])
		},

		created() {
			eventBus.$on('map:resize', function () {
				console.log('@map:resize');
				if (map) {
					map.resize();
				}
			});

			this.$watch('vStyle', this.track_vStyle, {deep: true});
		},

		mounted() {
			this.initMap();
			eventBus.$on('map:layer.update', this.onLayerUpdate);
		},

		methods: {
			...mapMutations({
				setMapPopup: types.SET_MAP_POPUP,
				setLayer: types.SET_LAYER,
			}),

			track_vStyle(vStyle) {
				if (!vStyle) { return; }

				if (!map) {
					_initialStyle = vStyle;
					return;
				}

				let mHash = map.isStyleLoaded() ? JSON.stringify(map.getStyle(), null, '') : '';
				let vHash = JSON.stringify(vStyle, null, '');

// console.log(' * style diff : ', (mHash !== vHash));

				if (mHash !== vHash) {
					this.applyStyle(vStyle);
				}
			},

			onLayerUpdate(layerId, values, layerNewStyle) {
				console.log('map:layer.update', layerId, values, layerNewStyle);

				let {cmd, unhandledParams} = updateMapLayer(layerId, values, map);

				if (!Object.keys(unhandledParams).length) {
					forOwn(cmd, function (fn) {
						fn.call();
					});
				}

				this.setLayer({layerId: layerId, value: layerNewStyle});
			},

			applyStyle (value) {
				map.setStyle(value);
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
				    this.applyStyle(_initialStyle);
				    _initialStyle = undefined;
				}

				let nav = new mapboxgl.NavigationControl();
				map.addControl(nav, 'top-left');

				function onInteraction(e) {
					if (vm.getPopupFeatures && vm.getPopupFeatures.length) {
						vm.setMapPopup({features:[]});
					}
				}

				'dragstart zoomstart resize'.split(' ').forEach(function(event){
					map.on(event, onInteraction);
				})

				map.on('click', function (e) {
					if (vm.getPopupFeatures && vm.getPopupFeatures.length) {
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
