<template>

	<ul v-if="isRoot" class="tile__root" v-sortable="options">
		<layer-list-item :model="listItem" v-bind:itemIndex="listKey" v-for="(listItem, listKey, listIndex) in model"></layer-list-item>
	</ul>

	<li v-else-if="isFolder" class="tile tile__folder">
		<span class="tile__name bold" @click.self="toggle">{{ model.name }} [ {{open ? '-' : '+'}} ]</span>
		<ul v-show="open" class="tile__list" v-sortable="options" >
			<li class="hidden"> </li>
			<layer-list-item :model="listItem" v-bind:groupIndex="itemIndex" v-bind:itemIndex="listKey" v-for="(listItem, listKey, listIndex) in model.children"></layer-list-item>
		</ul>
	</li>

	<li v-else>{{model.name}}</li>

</template>



<script>
import sortable from '../../directives/sortable'

export default {
	name: 'LayerListItem',
	directives: {
		sortable
	},
	props: {
		model: [Object, Array],
		groupIndex: [Number],
		itemIndex: [Number]
	},

	data() {
		return {
			open: true,
			options: {
				group: 'layers',
				// Element is dropped into the list from another list
				onAdd: function (/**Event*/evt) {
					let itemEl = evt.item;  // dragged HTMLElement
					let fromEl = evt.from;  // previous list
					console.log('fromEl', fromEl, 'el', itemEl);

					// + indexes from onEnd
				},

				// Changed sorting within list
				onUpdate: function (/**Event*/evt) {
					console.log(' onUpdate() el', evt.item, evt);
				},

				onChoose: function (evt) {
					console.log('onChoose', evt);
				},

				onEnd: function (evt) {
					console.log(' onEnd() old', evt.oldIndex, 'new' ,evt.newIndex);
				},

				onMove: function onMove( evt, originalEvent) {
					let drag = evt.dragged;
					let	rel = evt.related;
					if (drag.matches('.tile__folder') && !rel.parentNode.matches('.tile__root')) {
						return false;
					}
				}
			}
		}
	},
	
	mounted: function() {
//		console.log('mounted', this);
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
			console.log('toggle()', this.model.name +':'+ this.open);
			
			if (this.isFolder) {
				this.open = !this.open
			}
		},
/*
		changeType: function () {
			if (!this.isFolder) {
				Vue.set(this.model, 'children', [])
				this.addChild()
				this.open = true
			}
		},
		addChild: function () {
			this.model.children.push({
				name: 'new stuff'
			})
		}
*/
	}
}

</script>

<style src="./LayerList.css" scoped></style>