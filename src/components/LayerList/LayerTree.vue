<template>
	<div class="pin-left col12 fill-dark2 dark xpace-bottom3">
		<div class="contain col12 clearfix pad0y fill-dark">
			<div class="clearfix">
				<div class="space-left1 strong small fl x-width10 space-right1 contain">
					<div class="contain col12 pointer">
						<div class="small pad0y truncate space-right2 strong"><span>{{ projectName || vStyle.name || '' }}</span>
							<button @click="editFullStyle" class="a pin-right pad0y icon pencil show-in-hover animate"></button>
						</div>
					</div>
				</div>
				<div id="card-publish-style" class="pad00y pad1x fr">
					<button @click="save"
							class="mvt-save round width5 pad0x pad00y micro button fill-denim"
							:class="{'loading fill-lighten0': isSaving}"
					>Save</button>
					<button title="Manage Projects" @click="toggleStyleModal" class="a inline space-left0 icon cloud pad00y align-top"></button>
				</div>
				<div class="keyline-bottom pin-bottom keyline-lighten0 space-left1 space-right1"></div>
			</div>
		</div>
		<div class="micro clearfix col12 fill-dark"><a
				@click.prevent="addNewLayer"
				class="inline micro pad0 strong " href="#"><span
				class="icon plus"></span>New layer</a>
			<div class="fr"><span class="space-right0"><button
					@click="duplicateLayer" class="inline icon duplicate a pad0y align-top "
					:class="{'dim noevents': !currentLayerId}"></button></span><span
					class="space-right0"><button
					@click="toggleFolder" class="inline icon a pad0y align-top "
					:class="[{'dim noevents': !currentLayerId}, icon.folder]"></button></span><span
					class="space-right0"><button
					@click="toggleVisibility" class="inline icon a pad0y align-top "
					:class="[{'dim noevents': !currentLayerId}, icon.eye]"></button></span><span
					class="space-right0"><button
					@click="removeCurrentLayer" class="inline icon trash a pad0y align-top "
					:class="{'dim noevents': !currentLayerId}"></button></span></div>
		</div>

		<LayerTreeItem :model="tree.listData"></LayerTreeItem>

	</div>
</template>

<script>
	import LayerTreeItem from './LayerTreeItem.vue'
	import {eventBus} from '../../main'
	import dragula from 'dragula'
	import * as utils from '../../utils'
	import {cloneDeep, get, set, pick} from 'lodash'
	import {buildTreeData, exportStyle, updateLayers, indexLayers, indexTree, ensureStyleHasGroup, objectDiff, newLayerTemplate} from '../../util/styleSync'
	import mbStyle from '../../style.conf'
	import * as types from '../../store/mutation-types'
	import {mapMutations, mapState, mapGetters} from 'vuex';
	import storage from '../../util/storage'


	// drag-and-drop instance
	let drake;

	export default {
		name: 'LayerTree',
		components: {
			LayerTreeItem
		},

		data() {
			return {
				icon: {
					eye: 'noeye',
					folder: 'folder'
				},
				// grouped (tree structure)
				tree: {
					listData: buildTreeData(mbStyle)
				}
			}
		},

		computed: {
			...mapState([
				'projectId',
				'projectName',
				'currentLayerId',
				'vStyle',
				'vTree',
				'isLoading',
				'isSaving'
			]),
			...mapGetters([
				'getCurrentLayer',
				'getLayer',
				'getLayerIndex',
				'getLayerByIndex',
				'getTreeIndex'
			])
		},

		watch: {
			vTree(newVTree) {
				this.setListData(newVTree);
			},
			currentLayerId(layerId) {
				this.setEyeIcon();
				this.setFolderIcon();
			},
			projectId(projectId, prevId) {
				if (this.isLoading) { return; }

				console.log(' * projectId : ', prevId +' -> ' + projectId);
				const vm = this;
				vm.setLoading(true);
				
				storage.getProject(projectId, (xhr) => {
					let srcStyle;
					try {
						srcStyle = JSON.parse(xhr.responseText);
					} catch (e) {
						console.warn(' (!) JSON crash', xhr.responseText);
					}
					vm.setLoading(false);

					if (srcStyle) {
						vm.resetView();
						vm.initStyle(srcStyle);
					}
				});

			}
		},

		created() {
			eventBus.$on('ace:layer.updated', this.onLayerUpdated);
			eventBus.$on('tree:listdata.set', this.setListData);
		},

		mounted() {
			this.setStyle(mbStyle);
			eventBus.$emit('map:style.set', mbStyle);

			this.initDnD();
		},

		methods: {
			...mapMutations({
				toggleStyleModal: types.TOGGLE_MODAL,
				setStyle: types.SET_STYLE,
				setVStyle: types.SET_VSTYLE,
				setLayer: types.SET_LAYER,
				addLayerBefore: types.ADD_LAYER_BEFORE,
				addLayer: types.ADD_LAYER,
				dragDropLayer: types.DRAGDROP_LAYER,
				removeLayer: types.REMOVE_LAYER,
				groupLayer: types.GROUP_LAYER,
				ungroupLayer: types.UNGROUP_LAYER,
				setLoading: types.SET_LOADING,
				setSaving: types.SET_SAVING,

				setCurrentLayerId: types.SET_CURRENT_LAYER,
				editorPaneShow: types.EDITOR_PANE_SHOW,
				setEditorMode: types.SET_EDITOR_MODE
			}),

			initStyle(srcStyle) {
				this.setListDataFromStyle(srcStyle)
				this.setStyle(srcStyle);
			},
			resetView() {
				this.setCurrentLayerId(null);
				this.editorPaneShow(false);
			},

			setListData(vTreeValue) {
				// console.log(' * setListData() vTreeValue : ', vTreeValue);
				this.$set(this.tree, 'listData', [...vTreeValue]);

				// FF needs 300ms delay
				setTimeout(this.refreshContainers.bind(this), 300);

				eventBus.$emit('map:style.set', this.vStyle);
				this.updateLayerCode();
				this.setFolderIcon();
			},

			setListDataFromStyle(newStyle) {
				this.$set(this.tree, 'listData', buildTreeData(newStyle))
			},

			save() {
				const vm = this;
//				console.log('RESULT', JSON.stringify(this.vStyle));
				if (this.projectId < 1) {
					console.log('you should have load project with `cloudy icon` dialog');
					return;
				}
				vm.setSaving(true);
				storage.updateStyle(this.projectId, this.vStyle, function(xhrO){
					console.log(' * updateStyle xhrO : ', xhrO);
					vm.setSaving(false);
				});
				
			},

			// TODO: refactor icon routine
			getEyeIcon() {
				let v8y = this.getCurrentLayerVisibility();
				return ('visible' === v8y ? 'noeye' : 'eye');
			},
			getFolderIcon() {
				let folder = this.getCurrentLayerFolder();
				return (folder ? 'nofolder' : 'folder');
			},

			setEyeIcon() {
				this.$set(this.icon, 'eye', this.getEyeIcon());
			},
			setFolderIcon() {
				this.$set(this.icon, 'folder', this.getFolderIcon());
			},

			getCurrentLayerVisibility() {
				if (!this.currentLayerId) return 'visible';
				let layerId = this.currentLayerId,
					layerStyle = this.getLayer(layerId);
				return get(layerStyle, 'layout.visibility', 'visible');
			},

			getCurrentLayerFolder() {
				if (!this.currentLayerId) return;
				return this.getLayerFolder(this.currentLayerId);
			},

			getLayerFolder(layerId) {
				let layerStyle = this.getLayer(layerId);
				return get(layerStyle, ['metadata', 'mapbox:group']);
			},

			toggleFolder() {
				if (!this.currentLayerId) { return; }

				if ('nofolder' === this.icon.folder) {
					this.ungroupLayer(this.currentLayerId);
				}
				else {
					this.groupLayer(this.currentLayerId);
				}
			},

			makeUniqueLayerId(sourceString, postfix = '_copy_0') {
				let makeNewId = s => s.replace(/([^\d]*)(\d+)$/, function(m,p1,p2){
					return p1 + (+p2 + 1);
				});

				let nextLayerId;
				let parts = ('' + sourceString).match(/([^\d]*)(\d+)?$/);
				let assumed = sourceString + (parts[2] ? '' : postfix);

				let iterIndex, prevIndex;
				do {
					nextLayerId = makeNewId(assumed);
					assumed = nextLayerId;
					prevIndex = iterIndex;
					iterIndex = this.getLayerIndex(assumed);
				} while ('undefined' !== typeof iterIndex);
				return nextLayerId;
			},

			addNewLayer() {
				let refLayerId = this.currentLayerId || this.getLayerByIndex(0);
				let nextLayerId = this.makeUniqueLayerId('new_layer', '_0');
				let layer = {...newLayerTemplate,id: nextLayerId};
//				console.log('refLayerId',refLayerId, 'layer',layer);

				this.addLayer({refLayerId, layer});
				this.setCurrentLayerId(nextLayerId);
			},

			duplicateLayer() {
				if (!this.currentLayerId) { return; }

				let nextLayerId = this.makeUniqueLayerId(this.currentLayerId);
				let layer = {...this.getLayer(this.currentLayerId), id: nextLayerId };

				this.addLayerBefore({refLayerId: this.currentLayerId, layer});
			},

			getSiblingLayerId(currentlayerId, shift) {
				let nextLayerId = null;
				let currentIndex = this.getLayerIndex(currentlayerId);
				let nextIndex = currentIndex + shift;

				if (nextIndex < 0) {
					console.warn(`(!) getSiblingLayer( ${shift}, ${currentlayerId} ) : nextIndex is ${nextIndex}`);
				}
				else {
					let nextLayer = this.getLayerByIndex(nextIndex);
					if (nextLayer && nextLayer.id) {
						nextLayerId = nextLayer.id;
					}
				}

				return nextLayerId;
			},

			removeCurrentLayer() {
				if (!this.currentLayerId) { return; }

				let nextLayerId = this.getSiblingLayerId(this.currentLayerId, -1);
				this.removeLayer(this.currentLayerId);
				this.setCurrentLayerId(nextLayerId);
//				if (nextLayerId) this.setCurrentLayerId(nextLayerId);
			},

			toggleVisibility() {
				if (!this.currentLayerId) { return; }

				let layerId = this.currentLayerId,
					layerStyle = this.getLayer(layerId),
					layerNewStyle = cloneDeep(layerStyle),
					before = get(layerStyle, 'layout.visibility', 'visible'),
					current = 'visible' === before ? 'none' : 'visible';
				set(layerNewStyle, 'layout.visibility', current);
				let updateObj = pick(layerNewStyle, 'layout');
				eventBus.$emit('map:layer.update', layerId, updateObj);
				this.setLayer({layerId: layerId, value:layerNewStyle});
				eventBus.$emit('ace:content.set', layerNewStyle);

				this.setEyeIcon();
			},

			// layerId or current layer will be used
			updateLayerCode(layerId) {
				let layer = layerId && this.getLayer(layerId) || this.currentLayerId && this.getLayer(this.currentLayerId);
				if (!layer) { return; }
				eventBus.$emit('ace:content.set', layer);
			},

			onLayerUpdated(layerId, layerNewStyle) {
//				console.log('layer upd', layerId, layerNewStyle);
				let layerStyle = this.getLayer(layerId);
				// Avoid changing layerId by user
				layerNewStyle = {...layerNewStyle, id: layerId};

				let diffObj = objectDiff(layerNewStyle, layerStyle);
				this.setLayer({layerId: layerId, value: layerNewStyle});

				eventBus.$emit('map:layer.update', layerId, diffObj.update);
			},

			editFullStyle() {
				this.setEditorMode('style');
				eventBus.$emit('ace:content.set', this.vStyle);
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
						return el.matches('.draghost');
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
				this.dragDropLayer({sourceIndex, sourceGroupIndex, targetIndex, targetGroupIndex});

			},

			refreshContainers () {
				if (!drake) { return; }

				let uls = utils.byQS('.draghost', this.$el);

				drake.containers.splice(0);
				Array.from(uls).forEach(function(ul) {
					drake.containers.push(ul)
				});
			}

		}
	}

</script>

<style src="dragula/dist/dragula.css"></style>
