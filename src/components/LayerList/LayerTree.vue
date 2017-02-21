<template>
	<div>
<!--
		<button @click="pop">pop</button>
-->
		<layer-tree-item :model="listData"></layer-tree-item>
	</div>
</template>

<script>
	import LayerTreeItem from './LayerTreeItem.vue'
	import initialListData from './listData'
	import {eventBus} from '../../main'
	import dragula from 'dragula'
	import * as utils from '../../utils'

	let drake;

	export default {
		components: {
			LayerTreeItem
		},

		data() {
			return {
				listData: initialListData
			}
		},
		created() {
			this.$watch('listData', this.dataWatcher, {deep: true});
		},
		mounted() {
			this.initDnD();
			// manually run watcher on init
			this.dataWatcher();
		},

		methods: {
			modelToString() {
				return JSON.stringify(this.listData, ['name', 'children'], 2);
			},

			dataWatcher() {
				eventBus.$emit('ace:content.set', this.modelToString());
			},

			initDnD() {
				let options = {
					revertOnSpill: true,
					accepts(el, target, source, sibling) {
						if (el.classList.contains('tile__folder') &&
							!target.classList.contains('tile__root')) {
							return false;
						}
						if (!el.contains(target)) { return true; }
					},
					isContainer(el) {
						return el.tagName === 'ul';
					}
				};

				drake = dragula(options);
				this.refreshContainers();

				drake.on('drop', this.onDrop);
			},
			onDrop(el, target, source, sibling) {
				drake.cancel();

				let root = drake.containers[0],
					rootList = utils.getList(drake.containers[0]);

				let sourceList =  utils.getList(source),
					sourceIndex = sourceList.indexOf(el),
					sourceGroupIndex = -1;
				if (root !== source && root.contains(source)) {
					sourceGroupIndex = rootList.indexOf( source.closest('li') )
				}

				console.log(sourceIndex, '@', sourceGroupIndex);

				let targetList = utils.getList(target),
					targetIndex = targetList.indexOf(sibling),
					targetGroupIndex = -1;
				if (root !== target && root.contains(target)) {
					targetGroupIndex = rootList.indexOf( target.closest('li') )
				}
				console.log(targetIndex, '@', targetGroupIndex);

				let dataSource = sourceGroupIndex === -1 ? this.listData : this.listData[sourceGroupIndex].children;
				let dataTarget = targetGroupIndex === -1 ? this.listData : this.listData[targetGroupIndex].children;

				let takeOut = dataSource.splice(sourceIndex, 1)[0];
				let isMoveLocalFwd = targetGroupIndex === sourceGroupIndex && sourceIndex < targetIndex;

				targetIndex = targetIndex === -1
					? targetList.length
					: (isMoveLocalFwd ? targetIndex-1 : targetIndex);

				dataTarget.splice(targetIndex, 0, takeOut);

				setTimeout(this.refreshContainers.bind(this), 300);

			},

			refreshContainers () {
				if (!drake) { return; }

				let uls = utils.byQS('ul', this.$el);

				drake.containers.splice(0);

				utils.listFn(uls, 'forEach', function(ul) {
					drake.containers.push(ul)
				});
			}

		}
	}

</script>

<style src="dragula/dist/dragula.css"></style>
