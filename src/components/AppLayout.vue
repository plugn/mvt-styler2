<template>
	<div class="app-layout flex-col nodebug contain">
		<header class="keyline-bottom keyline-lighten0 title3d">mvt styler</header>

		<div class="flex-row">
			<div class="contain scroll-styled fill-dark2 dark" style="width:200px;">

				<LayerTree />

			</div>

			<div class="stretch fill-canvas">
				<MapGL></MapGL>
			</div>

			<Dashboard />

		</div>

	</div>

</template>

<script>
	import resize from '../directives/resize'
	import LayerTree from './LayerList/LayerTree.vue'
	import Editor from './Editor'
	import MapGL from './Map/index.vue'
	import {eventBus} from '../main';
	import dat from 'dat.gui/build/dat.gui';
	import Dashboard from './mbst/index.vue';

	export default {
		components: {
			Dashboard,
			LayerTree,
			MapGL,
			Editor
		},
		directives: {
			resize
		},
		data() {
			return {
				sideBar: 'tree',
				layerId: ''
			}
		},

		// mounted() {},

		methods: {
			onResize: function () {
				// console.log('onResize');
				setTimeout( (function () {
					eventBus.$emit('map:resize');
				}), 100);
			},
			setSideBar(name) {
				this.sideBar = name;
			},
			isActive(name) {
				return name === this.sideBar;
			}
		}
	}
</script>


<style src="./AppLayout.css"  scoped></style>
