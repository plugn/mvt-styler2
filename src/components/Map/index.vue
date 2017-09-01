<template>
	<div class="map" id="map-container"></div>
</template>

<script>

	import {eventBus} from '../../main'
	import icons from '../../util/icons.json'
//	import toColor from '@mapbox/to-color'
	import {updateMapLayer, prettifyMapLayer} from '../../util/styleSync'

	import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
	import * as types from '../../store/mutation-types'
	import {mapMutations} from 'vuex'

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
console.log('map:layer.update', layerId, values);

				let unhandledParams = updateMapLayer(layerId, values, map);
console.log('not applied with update:', unhandledParams);

//				let layerCode = prettifyMapLayer(map.getLayer(layerId));
//console.log('map.getLayer('+layerId+') :', layerCode);
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

				map.on('click', function (e) {


					let features = map.queryRenderedFeatures(e.point, {});



					let featList = features.map((feature) => `
<a  class="pad0x pad00y contain micro block truncate quiet" href="/edit/">
				<span class="space-left0 inline icon ${icons[feature.layer.type] || ''}"></span>
				${feature.layer.id}
			</a>
`).join();


					console.log('map click features', features, ' -> ', featList, 'point', e.point);

					vm.setMapPopup({features, point: e.point});



/*

					let html = `<div><div class="width16 map-popup pin-topleft" style="position: fixed; top: ${e.point.y}px; left:${e.point.x}px;">
<div class="round shadow scroll-styled dark fill-dark2" style="max-height: 180px;">
	<a class="pad0x pad00y contain micro block truncate quiet" href="/studio/styles/plugn/cj5cmjiv709622rmpaq1rpspe/edit/">
		<span class="space-left0 inline icon fill"></span>water_pattern</a>
	<a class="pad0x pad00y contain micro block truncate quiet" href="/studio/styles/plugn/cj5cmjiv709622rmpaq1rpspe/edit/">
		<span class="space-left0 inline icon fill"></span>water_offset</a>
	<a class="pad0x pad00y contain micro block truncate quiet" href="/studio/styles/plugn/cj5cmjiv709622rmpaq1rpspe/edit/">
		<span class="space-left0 inline icon globe"></span>background</a>
</div><div class="map-popup-nub"></div></div></div>`;
*/
//					new mapboxgl.Popup({closeOnClick: true})
//						.setLngLat(e.lngLat)
//						.setText('featList'+featList)
//						.addTo(map);

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
		cursor: pointer;
	}
</style>
