<template>
	<div class="panes">

		<div class="resizable scrollable-y" v-resize="{height:false}" data-handle="layers-resizer">
			<LayerTree />
		</div>
		<div class="el-resizer" ref="layers-resizer"></div>

		<div class="map-pane" v-resize="{height:false}" data-handle="map-resizer">
			<MapGL></MapGL>
		</div>
		<div class="el-resizer" ref="map-resizer"></div>

		<div class="pane editor-pane">
			<div class="toolbar" @click="trigger">[File] [Edit] [Help]</div>
			<Editor class="body"></Editor>
		</div>
	</div>

</template>

<script>
	import resize from '../../directives/resize'
//	import LayerList from '../LayerList/LayerList.vue'
	import LayerTree from '../LayerList/LayerTree.vue'
	import Editor from '../Editor'
	import MapGL from '../Map'
	import {eventBus} from '../../main';

	export default {
		components: {
			LayerTree,
			MapGL,
			Editor
		},
		directives: {
			resize
		},
		methods: {
			trigger: function () {
				console.log('Panes.trigger()');
				// eventBus.$emit('ace:content.set', JSON.stringify({'newKey': 'newValue'}));
			}

		},

		data() {
			return {
			}
		}
	}

</script>

<style lang="scss" src="./Panes.scss" scoped></style>