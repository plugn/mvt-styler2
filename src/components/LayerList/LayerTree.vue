<template>
	<div class="pin-left col12 fill-dark2 dark space-bottom3">
		<div class="contain col12 clearfix pad0y fill-dark">
			<div>
				<div data-test="rename-style" class="space-left1 strong small width10 space-right1 contain">
					<div class="contain col12 pointer">
						<div class="small pad0y truncate space-right2 strong"><span data-test="">StyleName</span>
							<button class="a pin-right pad0y icon pencil show-in-hover animate"></button>
						</div>
					</div>
				</div>
				<div id="card-publish-style" class="pad00y pad1x fr">
					<button class="round width5 pad0x pad00y micro button fill-denim">Save</button>
					<!--<button data-test="view-style" class="a inline space-left0 icon share pad00y align-top"></button>-->
				</div>
				<div class="keyline-bottom pin-bottom keyline-lighten0 space-left1 space-right1"></div>
			</div>
		</div>
		<div class="micro clearfix col12 fill-dark"><a data-test="new-layer" class="inline micro pad0 strong "
													   href="#"><span
				class="icon plus"></span>New layer</a>
			<div class="fr"><span class="space-right0"><button data-test="duplicate-layer"
															   class="inline icon duplicate a pad0y align-top "></button></span><span
					class="space-right0"><button class="inline icon nofolder a pad0y align-top "></button></span><span
					class="space-right0"><button class="inline icon noeye a pad0y align-top "></button></span><span
					class="space-right0"><button data-test="delete-layer"
												 class="inline icon trash a pad0y align-top "></button></span></div>
		</div>

		<div class="tree-view">
			<layer-tree-item :model="listData"></layer-tree-item>
		</div>

	</div>
</template>

<script>
	import LayerTreeItem from './LayerTreeItem.vue'
	import {eventBus} from '../../main'
	import dragula from 'dragula'
	import * as utils from '../../utils'
	import cloneDeep from 'lodash/cloneDeep';
	import {buildTreeData, exportStyle, indexLayers} from './styleSync'
	import mbStyle from '../../style.conf'

	// drag-and-drop instance
	let drake;

	// collection of plain virtual styles RAW
	let vStyles = [];

	// grouped virtual style RAW
	let gStyles = [];

	// layerId : arrayIndex
 	let vLayersIndex = {};

	export default {
		name: 'LayerTree',
		components: {
			LayerTreeItem
		},

		data() {
			return {
				// grouped style (Vue-model)
				listData: buildTreeData(cloneDeep(mbStyle))
			}
		},

		created() {
			this.set_vStyle(mbStyle);
			this.set_gStyle(mbStyle);
			this.$watch('listData', this.dataWatcher, {deep: true});
			
			
			eventBus.$on('ace:layer.updated', this.onLayerUpdated);
		},

		mounted() {
			this.initDnD();
			this.dataWatcher();
		},

		methods: {

			onLayerUpdated(layerId, code){
				console.log('layer upd', layerId, code);
				console.log('V', this.get_vStyle(), '\nG', this.get_gStyle() );
                
				let index = vLayersIndex[layerId];
				
				let newStyle = vStyles[vStyles.length-1];
				newStyle.layers[index]=code;
				eventBus.$emit('map:style.set', newStyle);
			},

			getLayer(layerId) {
				let index = vLayersIndex[layerId];
				return this.get_vStyle().layers[index];
			},

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
				gStyles.push( buildTreeData(cloneDeep( newValue )) );
			},

			dataWatcher() {
				let vStyle = this.get_vStyle();
				let gStyle = this.get_gStyle();

				let newStyle = exportStyle(vStyle, gStyle);
				vLayersIndex = indexLayers(newStyle.layers);
console.log('vLayersIndex', vLayersIndex);
				this.set_vStyle(newStyle);

				eventBus.$emit('map:style.set', newStyle);

				eventBus.$emit('editor:set', newStyle);
//				eventBus.$emit('ace:content.set', newStyle);
			},



			initDnD() {
				let options = {
					revertOnSpill: true,
					moves: function (el, container, handle) {
						return handle.classList.contains('drag-handle');
					},
					accepts(el, target, source, sibling) {
						if (el.classList.contains('tile__folder') &&
							!target.classList.contains('tile__root')) {
							return false;
						}
						if (!el.contains(target)) { return true; }
					},
					isContainer(el) {
						return el.matches('ul.draghost');
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

				let uls = utils.byQS('ul.draghost', this.$el);

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
		padding-left: 1rem;
	}
</style>
<style src="dragula/dist/dragula.css"></style>
