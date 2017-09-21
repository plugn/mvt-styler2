<template>
	<div class="layer-tree-next">

		<!--RESTYLE-->
		<span @click="onLogoClick" class="a inline micro pad1x pad00r">{{ route.name }}</span>
		<!--/RESTYLE-->



	</div>
</template>

<script>
	import {mapMutations, mapState, mapGetters} from 'vuex';


	export default {
		name: 'LayerTreeNext',
		components: {
//			LayerTreeItem
		},

		props:{
			onLogoClick: Function
		},

		data() {
			return {}
		},

		computed: {
			...mapState([
				'route'
			])
		},


		mounted() {
			// this.setStyle(mbStyle);
		},

	}

</script>

<style src="dragula/dist/dragula.css"></style>
