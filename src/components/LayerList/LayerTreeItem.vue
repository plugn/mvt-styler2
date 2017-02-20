<template>

	<ul v-if="isRoot" class="tile__root" v-sortable="options">
		<layer-list-item :model="listItem" :itemIndex="listKey" v-for="(listItem, listKey) in model"></layer-list-item>
	</ul>

	<li v-else-if="isFolder" class="tile tile__folder">
		<span class="tile__name bold" @click.self="toggle">{{ model.name }} [ {{open ? '-' : '+'}} ]</span>
		<ul v-show="open" class="tile__list" v-sortable="options" :data-group="itemIndex">
			<li class="hidden"></li>
			<layer-list-item
					v-for="(listItem, listKey) in model.children"
					:model="listItem"
					:itemIndex="listKey"
					:data-group="itemIndex"></layer-list-item>
		</ul>
	</li>

	<li v-else class="tile">{{model.name}}</li>

</template>


<script>
	import sortable from '../../directives/sortable'
	import {eventBus} from '../../main';

	export default {
		name: 'LayerListItem',
		directives: {
			sortable
		},
		props: {
			model: [Object, Array],
			itemIndex: [Number]
		},

		data() {
			return {
				open: true,
				options: {
					group: 'layers',
					onAdd: function (evt) {
						eventBus.$emit('sortable:onAdd', evt);
					},
					onUpdate: function (evt) {
						eventBus.$emit('sortable:onUpdate', evt);
					},
					onMove: function onMove(evt, originalEvent) {
						let drag = evt.dragged;
						let rel = evt.related;
						if (drag.matches('.tile__folder') && !rel.parentNode.matches('.tile__root')) {
							return false;
						}
					}
				}
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
				console.log('toggle()', this.model.name + ':' + this.open);

				if (this.isFolder) {
					this.open = !this.open
				}
			}
		}
	}

</script>

<style src="./LayerList.css" scoped></style>