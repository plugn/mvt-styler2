<template>
</template>

<script>
	import resize from '../directives/resize/resize'
	import LayerTree from './LayerList/LayerTree.vue'
	import Editor from './Editor'
	import MapGL from './Map/index.vue'
	import MapPopup from './Map/Popup.vue'
	import {eventBus} from '../main';
	import LayerEditor from './LayerEditor.vue'
	import ModalProjects from '../components/modal/Projects.vue'
	import {mapState} from 'vuex'

	export default {
		name: 'BaseLayout',
		components: {
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
				'route',
				'currentLayerId',
				'modalProjectsShow',
				'editorPaneShow'
			])
		},

		methods: {
			onLogoClick: function() {
				console.log(' * onLogoClick() this.route : ', this.route);

				let path = this.route.name === 'new' ? '/' : '/new';
				this.$router.push({path});
			},
			onAfterResize: function() {
				eventBus.$emit('map:resize');
			}
		}
	}
</script>

<style src="../directives/resize/resize.css"></style>