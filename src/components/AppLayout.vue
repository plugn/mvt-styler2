<template>
<div style="height: inherit;">
	<div class="app-layout flex-col nodebug contain">
		<!--<header class="keyline-bottom keyline-lighten0 title3d">mvt styler</header>-->

		<div class="flex-row">
			<div class="contain fill-dark2 dark"
				 style="width:250px; min-width:220px;"
				 v-resize="{height:false}" data-handle="tree-resizer">

				<LayerTree />

			</div>
			<div class="resizer" ref="tree-resizer"></div>

			<LayerEditor v-show="editorPaneShow" />

			<div class="stretch fill-canvas" style="position: relative;">
				<MapGL></MapGL>
				<MapPopup></MapPopup>
			</div>

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
	import MapPopup from './Map/Popup.vue'
	import {eventBus} from '../main';
	import Dashboard from './mbst/index.vue';
	import LayerEditor from './LayerEditor.vue'
	import ModalProjects from '../components/modal/Projects.vue'
	import {mapState} from 'vuex'


	export default {
		components: {
			Dashboard,
			LayerTree,
			LayerEditor,
			MapGL,
			Editor,
			ModalProjects,
			MapPopup
		},
		directives: {
			resize
		},

		computed: {
			...mapState([
				'currentLayerId',
				'modalProjectsShow',
				'editorPaneShow'
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