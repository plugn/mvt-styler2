<template>
	<layer-list-item :model="listData" @onUpdate="onUpdate" @onAdd="onAdd"></layer-list-item>
</template>

<script>
	import LayerListItem from './LayerListItem.vue'
	import listData from './listData'
	import {eventBus} from '../../main'
	import _ from 'lodash'

	function moveArrayItem(list, fromIndex, toIndex) {
		list.splice(toIndex, 0, list.splice(fromIndex, 1)[0])
		return list
	}

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
			eventBus.$on('sortable:onUpdate', this.onUpdate);
			eventBus.$on('sortable:onAdd', this.onAdd);
			eventBus.$emit('ace:content.set', JSON.stringify(listData, null , 2));
		},
		methods: {
			// inside one list
			onUpdate(evt) {
				console.log('::onUpdate() '+evt.type+'\n\
					what:', evt.item, 'from: ', evt.from, ' to', evt.to, ' :', evt.oldIndex +'>'+ evt.newIndex)
				console.log('data-group:',evt.to.dataset.group);
				let groupId = evt.to.dataset.group,
					list;

				if (groupId) {
					let list = this.listData[groupId].children;
					if (list) {
						list = list.slice();
					}
					console.log('===', list);

					moveArrayItem(list, evt.from - 1, evt.to - 1);
					console.log('after', list);
					
					this.$set(this.listData[groupId], 'children', list)
				}
				
			},
			// different lists
			onAdd(evt) {
				console.log('::onAdd() '+evt.type+'\n\
					what:', evt.item, 'from: ', evt.from, ' to', evt.to, ' :', evt.oldIndex +'>'+ evt.newIndex, ' group:',evt.to.dataset.group)
			}
		}
	}

</script>
