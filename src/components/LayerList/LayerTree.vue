<template>
	<div class="tree-view">
<!--
		<button @click="pop">pop</button>
-->
		<layer-tree-item :model="listData"></layer-tree-item>
	</div>
</template>

<script>
	import LayerTreeItem from './LayerTreeItem.vue'
//	import initialListData from './listData'
	import {eventBus} from '../../main'
	import dragula from 'dragula'
	import * as utils from '../../utils'
	import _ from 'lodash'
	import {buildTreeData, exportStyle} from './styleSync'
	import mbStyle from '../../res/bright-v9.json'

	// drag-and-drop instance
	let drake;

	// collection of plain virtual styles RAW
	let vStyles = [];

	// grouped virtual style RAW
	let gStyles = [];


	export default {
		components: {
			LayerTreeItem
		},

		data() {
			return {
				// grouped style (Vue-model)
				listData: buildTreeData(_.cloneDeep(mbStyle))
			}
		},

		created() {
			this.set_vStyle(mbStyle);
			this.set_gStyle(mbStyle);
			this.$watch('listData', this.dataWatcher, {deep: true});
		},

		mounted() {
window.mbStyle = mbStyle;

			this.initDnD();
			this.dataWatcher();
		},

		methods: {
			get_vStyle() {
				return vStyles[vStyles.length-1];
			},
			get_gStyle() {
				return gStyles[gStyles.length-1];
			},
			set_vStyle(newValue) {
				vStyles.push( newValue );
			},
			set_gStyle(newValue) {
				gStyles.push( buildTreeData(_.cloneDeep( newValue )) );
			},

			modelToString() {
				return JSON.stringify(this.listData, ['id', 'groupId', 'children'], '\t');
			},

			dataWatcher() {
				let vStyle = this.get_vStyle();
				let gStyle = this.get_gStyle();

				let newStyle = window.newStyle = exportStyle(vStyle, gStyle);
				eventBus.$emit('map:style.set', newStyle);

				let value = JSON.stringify(newStyle, null, '\t');

				eventBus.$emit('ace:content.set', value);
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

				drake.on('drop', this.onDrop.bind(this));
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

//console.log('source', sourceIndex, '@', sourceGroupIndex);

				let targetList = utils.getList(target),
					targetIndex = targetList.indexOf(sibling),
					targetGroupIndex = -1;
				if (root !== target && root.contains(target)) {
					targetGroupIndex = rootList.indexOf( target.closest('li') )
				}
//console.log('target', targetIndex, '@', targetGroupIndex);

				let gStyle = this.get_gStyle();

				let mirrorSource = sourceGroupIndex === -1 ? gStyle : gStyle[sourceGroupIndex].children;
				let mirrorTarget = targetGroupIndex === -1 ? gStyle : gStyle[targetGroupIndex].children;
				let dataSource = sourceGroupIndex === -1 ? this.listData : this.listData[sourceGroupIndex].children;
				let dataTarget = targetGroupIndex === -1 ? this.listData : this.listData[targetGroupIndex].children;

				let isMoveLocalFwd = targetGroupIndex === sourceGroupIndex && sourceIndex < targetIndex;
				targetIndex = targetIndex === -1
					? targetList.length
					: (isMoveLocalFwd ? targetIndex-1 : targetIndex);

				// data mutation
				let mirrorTakeOut = mirrorSource.splice(sourceIndex, 1)[0];
				mirrorTarget.splice(targetIndex, 0, mirrorTakeOut);

				let takeOut = dataSource.splice(sourceIndex, 1)[0];
				dataTarget.splice(targetIndex, 0, takeOut);

				// FF needs 300ms delay
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

<style scoped>
	.tree-view {
		margin-left: 20px;
	}
</style>
<style src="dragula/dist/dragula.css"></style>
