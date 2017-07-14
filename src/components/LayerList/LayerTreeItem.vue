<template>

	<ul v-if="isRoot" class="draghost tile__root gu-unselectable micro">
		<LayerTreeItem :model="listItem" :itemIndex="listKey" v-for="(listItem, listKey) in model"></LayerTreeItem>
	</ul>

	<li v-else-if="isFolder" class="col12 clearfix contain dark">
		<div class="animate false  draggable layer-group"><a
				class="pin-topleft z1 icon caret-down pad00y"></a>
			<div title="Group" @click="toggle"
				 class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro"><span
					class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>
				<div class="pad0x micro" style="padding-left: 27px;">
					<div class="contain col12 ">
						<div class="truncate layer-folder-title"><span data-test="">{{ model.id }}</span><span
								class="quiet space-left0">{{model.children.length}} layers</span>
							<button class="pin-topright animate icon"></button>
						</div>
					</div>
				</div>
				<span class="pin-topright z1 drag-handle animate"></span>
			</div>
		</div>
		<ul v-show="open">
			<ListGroupItem
					v-for="(listItem, listKey) in model.children"
					:model="listItem"
					:itemIndex="listKey"
					:data-group="itemIndex"></ListGroupItem>
		</ul>
	</li>

<!--
	<li v-else-if="0 && isFolder" class="tile tile__folder">
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
-->



	<ListItem v-else :model="model"></ListItem>

	<!--<li v-else class="tile" @click.self="tweakLayer(model.id)">{{model.id}}</li>-->

</template>


<script>
	import {eventBus} from '../../main'
	import ListItem from  './ListItem.vue'
	import ListGroupItem from './ListGroupItem.vue'


	export default {
		name: 'LayerTreeItem',
		components: {
			ListItem,
			ListGroupItem
		},
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

