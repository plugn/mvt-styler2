<template>
	<layer-list-item :model="listData"></layer-list-item>
</template>

<script>
	import LayerListItem from './LayerListItem.vue'
	import listData from './listData';
	import {eventBus} from '../../main';


	export default {
		components: {
			LayerListItem
		},

		data() {
			return {
				listData
			}
		},
		mounted() {
			eventBus.$emit('ace:content.set', JSON.stringify(listData, null , 2));
			this.$on('data.updated', (value) => {
				console.log('data.updated', value);
			});
		}

	}
</script>
