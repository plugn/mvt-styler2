<template>

	<ul v-if="isRoot" class="tile__root">
		<layer-tree-item :model="listItem" :itemIndex="listKey" v-for="(listItem, listKey) in model"></layer-tree-item>
	</ul>

	<li v-else-if="isFolder" class="tile tile__folder">
		<span class="tile__name bold" @click.self="toggle">{{ model.name }} [ {{open ? '-' : '+'}} ]</span>
		<ul v-show="open" class="tile__list" :data-group="itemIndex">
			<li hidden></li>
			<layer-tree-item
					v-for="(listItem, listKey) in model.children"
					:model="listItem"
					:itemIndex="listKey"
					:data-group="itemIndex"></layer-tree-item>
		</ul>
	</li>

	<li v-else class="tile">{{model.name}}</li>

</template>


<script>
	import sortable from '../../directives/sortable'
	import {eventBus} from '../../main';

	export default {
		name: 'LayerTreeItem',
		directives: {
			sortable
		},
		props: {
			model: [Object, Array],
			itemIndex: [Number]
		},

		data() {
			return {
				open: true
			}
		},

		computed: {
			isFolder: function () {
				return this.model.children &&
					this.model.children.length
			},
			isRoot: function () {
				return Array.isArray(this.model);
			}
		},
		methods: {
			toggle: function () {
//				console.log('toggle()', this.model.name + ':' + this.open);
				if (this.isFolder) {
					this.open = !this.open
				}
			}
		}
	}

</script>

<style src="./LayerList.css" scoped></style>