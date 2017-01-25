<template>
	<ul id="demo">
		<tree-item
				class="tree-item"
				:model="treeData">
		</tree-item>
	</ul>
</template>
<style scoped>
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
	import TreeItem from '../TreeItem.vue'
	import treeData from './treeData'
	export default {
		components: {
			TreeItem
		},
		data() {
			return {
				treeData
			}
		}
	}
</script>