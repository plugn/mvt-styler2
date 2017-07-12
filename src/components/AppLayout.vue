<template>
	<div class="app-layout flex-col debug">
		<header>awesome site header</header>

		<div class="flex-row">
<!--
			<div class="scroll">
				<ul style="margin: 0 150px;">
					<li v-for="n in 5"> option {{ n }}</li>
				</ul>
			</div>
-->
			<Dashboard />

			<div class="flex-col">
				<div class="stretch">1</div>
				<div class="stretch">2</div>
				<div class="flex-col scroll-x">
					<div class="stretch w1000">
						BLA BLA BLA BLE BLE FLA BLA BLA BLA BLE
						BLE FLA BLA BLA BLA BLE BLE FLA BLA BLA BLA BLE BLE FLA BLA BLA BLA BLE BLE FLA BLA BLA BLA
						BLE BLE FLA BLA BLA BLA BLE BLE FLA BLA BLA BLA BLE BLE FLA BLA BLA BLA BLE BLE FLA BLA BLA
						BLA BLE BLE FLA BLA BLA BLA BLE BLE FLA BLA BLA BLA BLE BLE FLA
					</div>
				</div>
			</div>

		<div class="stretch scroll"> stretchy content
			<ul>
				<li v-for="n in 50"> option {{ n }}</li>
			</ul>
		</div>

	</div>

	<!--<footer></footer>-->
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
