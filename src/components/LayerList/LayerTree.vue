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
					<button @click="save" class="round width5 pad0x pad00y micro button fill-denim">Save</button>
					<button title="Manage Projects" @click="toggleStyleModal" class="a inline space-left0 icon cloud pad00y align-top"></button>
				</div>
				<div class="keyline-bottom pin-bottom keyline-lighten0 space-left1 space-right1"></div>
			</div>
		</div>
		<div class="micro clearfix col12 fill-dark"><a class="inline micro pad0 strong "
													   href="#"><span
				class="icon plus"></span>New layer</a>
			<div class="fr"><span class="space-right0"><button class="inline icon duplicate a pad0y align-top "
					:class="{'dim noevents': !currentLayerId}"></button></span><span
					class="space-right0"><button class="inline icon nofolder a pad0y align-top "
					:class="{'dim noevents': !currentLayerId}"></button></span><span
					class="space-right0"><button
					@click="toggleVisibility" class="inline icon a pad0y align-top "
					:class="[{'dim noevents': !currentLayerId}, icon.eye]"></button></span><span
					class="space-right0"><button class="inline icon trash a pad0y align-top "
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
	import {buildTreeData, exportStyle, indexLayers, objectDiff} from '../../util/styleSync'
	import mbStyle from '../../style.conf'
	import * as types from '../../store/mutation-types'
	import {mapMutations, mapState, mapGetters} from 'vuex';
	import storage from '../../util/storage'


	// drag-and-drop instance
	let drake;

	// {array} GL Style grouped Layers
	// array of regular items {object} and/or groups {id:groupId, children: [{object}, ...]}
	let gLayers = null;

	export default {
		name: 'LayerTree',
		components: {
			LayerTreeItem
		},

		data() {
			return {
				icon: {
					eye: 'noeye'
				},
				// grouped (tree structure)
				tree: {
					listData: buildTreeData(cloneDeep(mbStyle))
				}
			}
		},

		computed: {
			...mapState([
				'projectId',
				'projectName',
				'currentLayerId',
				'vStyle',
				'isLoading'
			]),
			...mapGetters([
				'getCurrentLayer',
				'getLayer'
			])
		},

		watch: {
			currentLayerId(layerId) {
				this.setEyeIcon();
			},
			projectId(projectId, prevId) {
				console.log(' isLoading:', this.isLoading);
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
//						console.log(' * srcStyle : ', srcStyle);
						vm.initStyle(srcStyle);
					}
				});


			}
		},

		created() {
			this.setStyle(mbStyle);
			this.set_gStyle(mbStyle);

			eventBus.$on('ace:layer.updated', this.onLayerUpdated);
		},

		mounted() {
			this.$watch('tree.listData', this.dataWatcher, {deep: true, immediate: true});
			this.initDnD();
		},

		methods: {
			...mapMutations({
				toggleStyleModal: types.TOGGLE_MODAL,
				setStyle: types.SET_STYLE,
				setLayer: types.SET_LAYER,
				setLoading: types.SET_LOADING,
				setCurrentLayerId: types.SET_CURRENT_LAYER,
				editorPaneShow: types.EDITOR_PANE_SHOW
			}),

			initStyle(srcStyle) {
				this.setCurrentLayerId(null);
				this.setListData(srcStyle)
				this.setStyle(srcStyle);
				this.set_gStyle(srcStyle);
				this.editorPaneShow(false);
			},

			save() {
				console.log('RESULT', JSON.stringify(this.vStyle));
				if (this.projectId < 1) {
					console.log('you should have load project with `cloudy icon` dialog');
					return;
				}
				storage.updateStyle(this.projectId, this.vStyle, function(xhrO){
					console.log(' * updateStyle xhrO : ', xhrO);


				})
				
			},
			getEyeIcon() {
				let v8y = this.getCurrentLayerVisibility();
				return ('visible' === v8y ? 'noeye' : 'eye');
			},

			setEyeIcon() {
				this.$set(this.icon, 'eye', this.getEyeIcon());
			},

			getCurrentLayerVisibility() {
				if (!this.currentLayerId) return 'visible';
				let layerId = this.currentLayerId,
					layerStyle = this.getLayer(layerId);
				return get(layerStyle, 'layout.visibility', 'visible');
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
//					console.log('toggleVisibility', layerId, updateObj);
				eventBus.$emit('map:layer.update', layerId, updateObj);
				this.setLayer({layerId: layerId, value:layerNewStyle});
				eventBus.$emit('ace:content.set', layerNewStyle, {layerId});

				this.setEyeIcon();
			},

			// layerId or current layer will be used
			updateLayerCode(layerId) {
				let layer = layerId && this.getLayer(layerId) || this.currentLayerId && this.getLayer(this.currentLayerId);
				if (!layer) { return; }
				eventBus.$emit('ace:content.set', layer, {layerId});
			},

			onLayerUpdated(layerId, layerNewStyle) {
				console.log('layer upd', layerId, layerNewStyle);
				let layerStyle = this.getLayer(layerId);
				// Avoid changing layerId by user
				layerNewStyle = {...layerNewStyle, id: layerId};

				let diffObj = objectDiff(layerNewStyle, layerStyle);
				eventBus.$emit('map:layer.update', layerId, diffObj.update);

				this.setLayer({layerId: layerId, value: layerNewStyle});
			},

			setListData(newValue) {
				this.$set(this.tree, 'listData', buildTreeData(cloneDeep( newValue )))
			},

			get_gStyle() {
				return gLayers;
			},
			set_gStyle(newValue) {
				gLayers = buildTreeData(cloneDeep( newValue ));
			},

			dataWatcher() {
				let gStyle = this.get_gStyle();
				let newStyle = exportStyle(this.vStyle, gStyle);
				this.setStyle(newStyle);

				eventBus.$emit('map:style.set', newStyle);
				this.updateLayerCode();
			},

			editFullStyle() {
				console.log(' * editFullStyle : ');
				eventBus.$emit('ace:content.set', this.vStyle, {projectId: this.projectId});
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

				let gStyle = this.get_gStyle();

				let mirrorSource = sourceGroupIndex === -1 ? gStyle : gStyle[sourceGroupIndex].children;
				let mirrorTarget = targetGroupIndex === -1 ? gStyle : gStyle[targetGroupIndex].children;
				let dataSource = sourceGroupIndex === -1 ? this.tree.listData : this.tree.listData[sourceGroupIndex].children;
				let dataTarget = targetGroupIndex === -1 ? this.tree.listData : this.tree.listData[targetGroupIndex].children;

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
