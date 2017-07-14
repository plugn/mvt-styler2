<template>

	<ul v-if="isRoot" class="draghost tile__root gu-unselectable micro">
		<LayerTreeItem :model="listItem" :itemIndex="listKey" v-for="(listItem, listKey) in model"></LayerTreeItem>
	</ul>

	<li v-else-if="isFolder" class="tile tile__folder">
		<span class="tile__name bold" @click.self="toggle">{{ model.id }} [ {{open ? '-' : '+'}} ]</span>
		<ul v-show="open" class="draghost tile__list" :data-group="itemIndex">
			<li hidden></li>
			<LayerTreeItem
					v-for="(listItem, listKey) in model.children"
					:model="listItem"
					:itemIndex="listKey"
					:data-group="itemIndex"></LayerTreeItem>
		</ul>
	</li>

	<ListItem v-else :model="model"></ListItem>

	<!--<li v-else class="tile" @click.self="tweakLayer(model.id)">{{model.id}}</li>-->

</template>


<script>
	import {eventBus} from '../../main'
	import ListItem from  './ListItem.vue'

	export default {
		name: 'LayerTreeItem',
		components: {ListItem},
		props: {
			model: [Object, Array],
			itemIndex: [Number]
		},

		data() {
			return {
				open: false
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
				if (this.isFolder) {
					this.open = !this.open;
				}
			},
			tweakLayer(layerId) {
				console.log('tweakLayer()', layerId);
				eventBus.$emit('tweakLayer', layerId);
			}
		}
	}

</script>

