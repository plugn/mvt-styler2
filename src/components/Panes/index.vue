<template>
	<div class="panes">


		<div class="resizable scrollable-y" v-resize="{height:false}" data-handle="layers-resizer">
			<div class="toolbar gu-unselectable" @click="trigger">
				<span @click="setSideBar('tree')">Layers</span>
				<span @click="setSideBar('code')">Code</span>
			</div>

			<LayerTree v-show="isActive('tree')"></LayerTree>
			<Editor v-show="isActive('code')" class="body"></Editor>
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


//				let dat1 = new dat.GUI({autoPlace: false});
/*
				let dat1 = new dat.GUI();
				dat.add(data, 'id')
				dat.add(data, 'interactive')
*/

//				console.log('dat', this.$refs.dat);
//				(this.$refs.dat).appendChild(gui.domElement);

			})
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
			},
			setSideBar(name) {
console.log('name', name);
				
				this.sideBar = name;


			},
			isActive(name) {
				return name === this.sideBar;
			}


		}



	}

</script>

<style src="./Panes.scss" scoped></style>