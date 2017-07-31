<template>
<div style="height: inherit;">
	<div class="app-layout flex-col nodebug contain">
		<!--<header class="keyline-bottom keyline-lighten0 title3d">mvt styler</header>-->

		<div class="flex-row">
			<div class="contain fill-dark2 dark"
				 style="width:220px; min-width: 190px;"
				 v-resize="{height:false}" data-handle="tree-resizer">

				<LayerTree />

			</div>
			<div class="resizer" ref="tree-resizer"></div>

			<LayerEditor v-show="currentLayerId" />

			<div class="stretch fill-canvas">
				<MapGL></MapGL>
			</div>

			<!--<Dashboard />-->

		</div>
	</div>

	<ModalProjects :show="modalProjectsShow"></ModalProjects>

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
	import ModalProjects from '../components/modal/Projects.vue'
	import {mapState} from 'vuex'


	export default {
		components: {
			Dashboard,
			LayerTree,
			LayerEditor,
			MapGL,
			Editor,
			ModalProjects
		},
		directives: {
			resize
		},

		computed: {
			...mapState([
				'currentLayerId',
				'modalProjectsShow'
			])
		},

		methods: {
			onAfterResize: function() {
				eventBus.$emit('map:resize');
			}
		}
	}
</script>

<style src="./AppLayout.css"  scoped></style>
<style src="../directives/resize/resize.css"></style>