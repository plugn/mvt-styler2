<template>
	<ul class="tree-root">
		<tree-item
				class="tree-item"
				:model="treeData">
		</tree-item>
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
	import draggable from 'vuedraggable'
	import treeData from './treeData'
	export default {
		components: {
			draggable
		},

		data() {
			return {
				treeData
			}
		}
	}
</script>