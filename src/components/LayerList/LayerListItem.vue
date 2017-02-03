<template>
		<li v-if="isFolder" class="tile tile__folder">
			<span class="tile__name bold">[ {{ model.name }} ]</span>
			<ul class="tile__list" v-sortable="options">
				<li class="hidden"> </li>
				<layer-list-item :model="listItem" v-for="listItem in model.children"></layer-list-item>
			</ul>
		</li>
		<li v-else>{{model.name}}</li>


</template>


<script>
import sortable from '../../directives/sortable'
import * as utils from './utils'

export default {
	name: 'LayerListItem',
	directives: {
		sortable
	},

	props: {
		model: Object
	},

	data() {
		return {
			open: false,
			drag: false,

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

/*
	created() {
		console.log('LLI created() model', this.model);
	},
*/

	computed: {
		isFolder: function () {
			return this.model.children &&
				this.model.children.length
		}
	},
	methods: {
		onStart: function() {
			console.log('start');

			this.drag = true;
		},
		onEnd: function() {
			console.log('end');

			this.drag = false;
		},
		toggle: function () {
			if (this.isFolder) {
				this.open = !this.open
			}
		},
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
	}
}

</script>

<style src="./LayerList.css" scoped></style>