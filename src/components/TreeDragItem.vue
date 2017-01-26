<template>
	<div>
		<draggable :list="model.children || []" :options="sortableOptions"  @start="onStart" @end="onEnd">
			<li class="movable tree-leaf">
				<div
						:class="{bold: isFolder}"
						@click="toggle"
						@dblclick="changeType">
					{{model.name}}
					<span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
				</div>
				<ul v-show="open" v-if="isFolder" class="movable tree-folder">
					<tree-drag-item
							class="tree-item"
							v-for="model in model.children"
							:model="model">
					</tree-drag-item>
					<li class="add" @click="addChild">+</li>
				</ul>
			</li>
		</draggable>
	</div>
</template>

<script>
	import Vue from 'vue'
	import draggable from 'vuedraggable'


	export default {
		name: 'TreeDragItem',
		components: {
			draggable
		},

		props: {
			model: Object
		},
		data() {
			return {
				open: false,
				drag: false,
				sortableOptions: {
					group: 'treeNodes',
					draggable: '.movable'
				},

				onMove: function (evt) {
					console.log('Tree draggable::onMove() dragged: .'+evt.dragged.className+'('+ evt.dragged.innerText+')', ' \m->  ',
						'related: .'+evt.related.className+'('+evt.related.innerText+')');
					//console.log('dragged', evt.draggedContext, '->', evt.relatedContext);
				}
			}
		},

		created() {

			console.log('@created this.model', this.model.children);

		},
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