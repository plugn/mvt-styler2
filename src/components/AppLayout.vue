<template>
	<div class="app-layout flex-col nodebug contain">
		<header class="keyline-bottom keyline-lighten0 title3d">mvt styler</header>

		<div class="flex-row">
			<!-- TODO: scroll only LayerTree content -->
			<div class="contain scroll-styled fill-dark2 dark"
				 style="width:220px;"
				 v-resize="{height:false}" data-handle="tree-resizer">

				<LayerTree />

			</div>
			<div class="resizer" ref="tree-resizer"></div>

			<LayerEditor />

			<div class="stretch fill-canvas">
				<MapGL></MapGL>
			</div>

			<!--<Dashboard />-->

		</div>

	</div>

</template>

<script>
	import resize from '../directives/resize/resize'
	import LayerTree from './LayerList/LayerTree.vue'
	import Editor from './Editor'
	import MapGL from './Map/index.vue'
	import {eventBus} from '../main';
	import Dashboard from './mbst/index.vue';
	import LayerEditor from './LayerList/LayerEditor.vue'

	export default {
		components: {
			Dashboard,
			LayerTree,
			LayerEditor,
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
			onAfterResize: function() {
				eventBus.$emit('map:resize');
			},
			isActive(name) {
				return name === this.sideBar;
			}
		}
	}
</script>

<style src="./AppLayout.css"  scoped></style>
<style src="../directives/resize/resize.css"></style>