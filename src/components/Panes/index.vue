<template>
	<div class="panes">

		<div class="resizable scrollable-y" v-resize="{height:false}" data-handle="layers-resizer">
			<LayerTree />
		</div>
		<div class="el-resizer" ref="layers-resizer"></div>

		<div class="map-pane" v-resize="{height:false}" data-handle="map-resizer">
			<MapGL></MapGL>
		</div>
		<div class="el-resizer" ref="map-resizer" @mouseup="onResize"></div>

		<div class="pane editor-pane">
			<div class="toolbar gu-unselectable" @click="trigger">[File] [Edit] [Help]</div>
			<Editor class="body"></Editor>
		</div>
	</div>

</template>

<script>
	import resize from '../../directives/resize'
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
			onResize: function () {
				// console.log('onResize');
				setTimeout( (function () {
					eventBus.$emit('map:resize');
				}), 100);
			},
			trigger: function () {
//	console.log('Panes.trigger()');
			}

		},

		data() {
			return {
			}
		}
	}

</script>

<style lang="scss" src="./Panes.scss" scoped></style>