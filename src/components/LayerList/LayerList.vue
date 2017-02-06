<template>
	<layer-list-item :model="listData"></layer-list-item>
</template>

<style src="./LayerList.css" scoped></style>

<script>
	import sortable from '../../directives/sortable'
	import * as utils from './utils'
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
				listData,
				options: {
					group: 'layers',
					onMove: function onMove( /**Event*/ evt, /**Event*/ originalEvent) {
						let drag = evt.dragged;
						let	rel = evt.related;

						console.log(' onMove() ' + utils.descEl(drag) +'\n -> '+ utils.descEl(rel));
						if (drag.matches('.tile__folder') && !rel.parentNode.matches('.tile__root')) {
							return false;
						}
					}
				}

			}
		},

		methods: {
			isFolder: function (item) {
				return item.children && item.children.length;
			}
		},

	}
</script>
