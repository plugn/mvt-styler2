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
	import dragula from 'dragula'

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
		created() {
			this.$watch('listData', this.dataWatcher, {deep: true});
		},
		mounted() {
			console.log('$el', this.$el);

			eventBus.$on('sortable:onUpdate', this.onUpdate);
			eventBus.$on('sortable:onAdd', this.onAdd);
			this.dataWatcher();
		},

		methods: {
			modelToString() {
				return JSON.stringify(this.listData, ['name', 'children'], 2);
			},
			dataWatcher: function() {
				eventBus.$emit('ace:content.set', this.modelToString());
			},

			push: function () {
				let grouplist = this.listData[2].children.slice();
				grouplist.push({name: '==item=='});
				this.$set(this.listData[2], 'children', grouplist);

			},
			pop: function () {
				this.listData.pop();
//				this.listData[4].children.pop();
			},

			splice: function() {
				let fromIndex = 3, toIndex = 1;
//console.log(' splice ', fromIndex +' => '+ toIndex);
				this.listData.splice(toIndex, 0, this.listData.splice(fromIndex, 1)[0]);
			},

			// inside one list
			onUpdate(evt) {
				var fromGroup = evt.from.dataset.group || 'root',
					toGroup = evt.to.dataset.group || 'root';
				console.log('::onUpdate() ' + evt.item.innerText)
				console.log( `${evt.oldIndex}@${fromGroup}  > ${evt.newIndex}@${toGroup}`);
				let groupId = evt.to.dataset.group,
					list;

				if (groupId) {
					let groupList = this.listData[groupId].children.slice();
					console.log('g', groupList);
					
					groupList.splice(evt.newIndex - 1, 0, groupList.splice(evt.oldIndex - 1, 1)[0])

					this.$delete(this.listData[groupId], 'children');

					this.$set(this.listData[groupId], 'children', groupList);
				}

			},
			// different lists
			onAdd(evt) {
				var fromGroup = evt.from.dataset.group || 'root',
					toGroup = evt.to.dataset.group || 'root';
				console.log('::onAdd() ' + evt.item.innerText);
				console.log( `${evt.oldIndex}@${fromGroup}  > ${evt.newIndex}@${toGroup}`);

			}
		}
	}

</script>

<style src="dragula/dist/dragula.css"></style>