<template>
<div style="height: inherit;">
	<div class="app-layout flex-col nodebug contain">

		<div class="flex-row">
			<div class="contain fill-dark2 dark"
				 style="width:250px; min-width:220px;"
				 v-resize="{height:false}" data-handle="tree-resizer">

				<LayerTreeNext :onLogoClick="onLogoClick" />

			</div>
			<div class="resizer" ref="tree-resizer"></div>

			<LayerEditor v-show="editorPaneShow" />

			<div class="stretch fill-canvas" style="position: relative;">
				<!--<MapGL></MapGL>-->
				<!--<MapPopup></MapPopup>-->
			</div>

		</div>
	</div>

	<ModalProjects :show="modalProjectsShow"></ModalProjects>

</div>
</template>

<script>
	import BaseLayout from './BaseLayout.vue'
	import LayerTreeNext from './LayerList/LayerTreeNext.vue'

	export default {
		'name':		'NewLayout',
		'extends':	BaseLayout,
		components: {
			LayerTreeNext
		}
	}
</script>
