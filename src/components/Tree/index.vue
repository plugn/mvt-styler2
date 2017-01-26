<template>
	<ul class="tree-root">
		<tree-drag-item
				class="tree-item"
				:model="treeData">
		</tree-drag-item>
	</ul>
</template>
<style scoped>
	.tree-root {
		user-select: none;
	}

	.tree-item {
		cursor: pointer;
	}

	.bold {
		font-weight: bold;
	}

	ul {
		padding-left: 1em;
		line-height: 1.5em;
		list-style-type: dot;
	}
</style>
<script>
	import treeData from './treeData'
	import TreeDragItem from '../TreeDragItem.vue'

	export default {
		components: {
			TreeDragItem
		},

		data() {
			return {
				treeData
			}
		}
	}
</script>