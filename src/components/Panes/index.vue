<template>
	<div class="panes">


		<div class="resizable sidebar" v-resize="{height:false}" data-handle="layers-resizer">
			<div class="toolbar gu-unselectable">
				<span @click="setSideBar('tree')">Layers</span>
				<span @click="setSideBar('code')">Code</span>
			</div>

			<div class="content scrollable-y">
				<LayerTree v-show="isActive('tree')"></LayerTree>
				<Editor v-show="isActive('code')" class="body"></Editor>
			</div>
			<!--<Editor v-show="isActive('code')" class="body"></Editor>-->
			<div v-show="isActive('tweakLayer')">
				Tweak {{sideBar}} #{{layerId}}
				<div ref="dat">
					BLA


				</div>
			</div>
		</div>
		<div class="el-resizer" ref="layers-resizer"></div>

		<div class="pane">
			<MapGL></MapGL>
		</div>
	</div>

</template>

<script>
	import resize from '../../directives/resize'
	import LayerTree from '../LayerList/LayerTree.vue'
	import Editor from '../Editor'
	import MapGL from '../Map'
	import {eventBus} from '../../main';
	import dat from 'dat.gui/build/dat.gui';
	import dgLightTheme from 'dat-gui-light-theme/dat-gui-light-theme.css'
	import dgTweak from './dg-tweak.css'

console.log('dat', dat);

	export default {
		components: {
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

		mounted() {

			eventBus.$on('tweakLayer', (layerId) => {
				console.log('caught tweakLayer', layerId)
				let data = LayerTree.methods.getLayer(layerId);
				console.log('LayerTree', data);
				this.layerId = layerId;
				this.setSideBar('tweakLayer');

				let gui = new dat.gui.GUI({autoPlace: false});

//				gui.remember(data);
				gui.add(data, 'id');
				gui.add(data, 'interactive');

//				console.log('dat', this.$refs.dat);
				let container = this.$refs.dat;
				if (container) {
					container.innerHTML = '';
					container.appendChild(gui.domElement);
				}

			})
		},

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

<style src="./Panes.scss" scoped></style>
<!--<style src="dat-gui-light-theme/dat-gui-light-theme.css"></style>-->
