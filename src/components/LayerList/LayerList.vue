<template>
	<div>
		<button @click="push">push</button>
		<button @click="pop">pop</button>
		<button @click="splice">splice</button>
		<layer-list-item :model="listData"></layer-list-item>
	</div>
</template>

<script>
	import LayerListItem from './LayerListItem.vue'
	import initialListData from './listData'
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
				listData: initialListData
			}
		},

		mounted() {
			eventBus.$on('sortable:onUpdate', this.onUpdate);
			eventBus.$on('sortable:onAdd', this.onAdd);
			eventBus.$emit('ace:content.set', JSON.stringify(initialListData, null, 2));
		},
		watch: {
			listData: function(newValue, oldValue) {
				console.log('watch \nlistData:', newValue.map(v => v.name), '\nwas', oldValue.map(o => o.name));
				eventBus.$on('ace:content.set', JSON.stringify(this.listData, null, 2));
				
			}
		},
		methods: {
			push: function () {
				this.listData.push({name: ' +item'});
			},
			pop: function () {
				this.listData.pop();
			},

			splice: function() {
				let fromIndex = 3, toIndex = 1;

console.log(' splice ', fromIndex +' => '+ toIndex);

				this.listData.splice(toIndex, 0, this.listData.splice(fromIndex, 1)[0]);
			},

			// inside one list
			onUpdate(evt) {
				console.log('::onUpdate() ' + evt.type + '\n\
					what:', evt.item, 'from: ', evt.from, ' to', evt.to, ' :', evt.oldIndex + '>' + evt.newIndex)
				console.log('data-group:', evt.to.dataset.group);
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
				console.log('::onAdd() ' + evt.type + '\n\
					what:', evt.item, 'from: ', evt.from, ' to', evt.to, ' :', evt.oldIndex + '>' + evt.newIndex, ' group:', evt.to.dataset.group)
			}
		}
	}

</script>
