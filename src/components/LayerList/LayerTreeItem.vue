<template>
	<!--<div id="layers" class="col12 scroll-styled space-top7 pin-left pad0y keyline-bottom">-->

	<ul v-if="isRoot" class="tile__root scroll-styled draghost gu-unselectable micro" style="height: 100%;">
		<LayerTreeItem :model="listItem" :itemIndex="listKey" v-for="(listItem, listKey) in model"></LayerTreeItem>
	</ul>

	<li v-else-if="isFolder" class="tile__folder col12 clearfix contain dark">
		<div class="animate draggable layer-group"><a @click="toggle"
				v-bind:class="{'caret-right': !open, 'caret-down': open}"
				class="pin-topleft z1 icon pad00y"></a>
			<div title="Group"
				 class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro"><span
					class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>
				<div @click="toggle" class="pad0x micro" style="padding-left: 27px;">
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
		<ul v-show="open" class="draghost ">
			<ListGroupItem
					v-for="(listItem, listKey) in model.children"
					:model="listItem"
					:itemIndex="listKey"
					:data-group="itemIndex"></ListGroupItem>
		</ul>
	</li>

	<ListItem v-else :model="model"></ListItem>

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
			}
		}
	}

</script>

<style scoped>
	.tile__root {
		padding-left: .5rem;
	}
</style>