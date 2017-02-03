<template>
	<ul class="tile__root" v-sortable="options">
		<layer-list-item :model="listItem" v-for="listItem in listData"></layer-list-item>
	</ul>
</template>

<style src="./LayerList.css" scoped></style>

<script>
	import sortable from '../../directives/sortable'
	import LayerListItem from './LayerListItem.vue'
	import listData from './listData';

	export default {

		directives: {
			sortable
		},

		components: {
			LayerListItem
		},

		data() {
			return {
				options: {group:'layers'},
				listData
			}
		},

		methods: {
			isFolder: function (item) {
				return item.children && item.children.length;
			}
		},

	}
</script>
