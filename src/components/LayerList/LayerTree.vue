<template>
	<div>
		<button @click="push">push</button>
		<button @click="pop">pop</button>
		<button @click="splice">splice</button>
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
			console.log('$el', this.$el);

			eventBus.$on('sortable:onUpdate', this.onUpdate);
			eventBus.$on('sortable:onAdd', this.onAdd);

			this.initDnD();
			// manually run watcher on init
			this.dataWatcher();
		},

		methods: {
			modelToString() {
				return JSON.stringify(this.listData, ['name', 'children'], 2);
			},

			dataWatcher() {
//				console.log('dataWatcher', this.modelToString());
				this.refreshContainers();
				eventBus.$emit('ace:content.set', this.modelToString());
			},

			initDnD() {
				let options = {
					revertOnSpill: true,
					accepts(el, target, source, sibling) {
						if (!el.contains(target))
							return true;
					}
				};

				drake = dragula([], options);

				drake.on('drop', (el, target, source, sibling) => {
					drake.cancel();

					let root = drake.containers[0],
						rootList = utils.getList(drake.containers[0]);

					let sourceList =  utils.getList(source),
						sourceIndex = sourceList.indexOf(el),
						sourceGroupIndex = -1;
					if (root !== source && root.contains(source)) {
//						console.log('root', root, 'contains source', source);

						sourceGroupIndex = rootList.indexOf( source.closest('li') )
					}

					// console.log('sourceList: ', sourceList, 'sourceIndex');
					console.log(sourceIndex, '@', sourceGroupIndex);

					let targetList = utils.getList(target),
						targetIndex = targetList.indexOf(sibling),
						targetGroupIndex = -1;
					if (root !== target && root.contains(target)) {
//						console.log('root', root, 'contains target', target);

						targetGroupIndex = rootList.indexOf( target.closest('li') )
					}
					// console.log('targetList: ', targetList, 'targetIndex', targetIndex, '@', targetGroupIndex);
					console.log(targetIndex, '@', targetGroupIndex);

					let dataSource = sourceGroupIndex === -1 ? this.listData : this.listData[sourceGroupIndex].children;
					let dataTarget = targetGroupIndex === -1 ? this.listData : this.listData[targetGroupIndex].children;

					let takeOut = dataSource.splice(sourceIndex, 1)[0];
					let isMoveLocalFwd = targetGroupIndex === sourceGroupIndex && sourceIndex < targetIndex;

					targetIndex = targetIndex === -1
						? targetList.length
						: (isMoveLocalFwd ? targetIndex-1 : targetIndex);

					dataTarget.splice(targetIndex, 0, takeOut);

				})


			},

			refreshContainers () {
				if (!drake) { return; }

				let uls = utils.byQS('ul',this.$el);
				// clear previous containers
				drake.containers.splice(0);
				// set new ones
				utils.listFn(uls, 'forEach', (ul) => drake.containers.push(ul));
				console.log('containers', drake.containers);

			},

			push () {
				let grouplist = this.listData[2].children.slice();
				grouplist.push({name: '==item=='});
				this.$set(this.listData[2], 'children', grouplist);

			},
			pop () {
				this.listData.pop();
//				this.listData[4].children.pop();
			},

			splice() {
				let fromIndex = 3, toIndex = 1;
				this.listData.splice(toIndex, 0, this.listData.splice(fromIndex, 1)[0]);
			},

		}
	}

</script>

<style src="dragula/dist/dragula.css"></style>
