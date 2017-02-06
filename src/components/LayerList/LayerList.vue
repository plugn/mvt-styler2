<template>
	<layer-list-item :model="listData"></layer-list-item>
</template>

<script>
	import LayerListItem from './LayerListItem.vue'
	import listData from './listData';

	export default {
		components: {
			LayerListItem
		},

		data() {
			return {
				listData
			}
		}
	}
</script>
