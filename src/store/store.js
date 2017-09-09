import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import {cloneDeep, get, set, pick, keys, map} from 'lodash'
import {
	indexLayers,
	indexTree,
	buildTreeData,
	exportStyle,
	ensureStyleHasGroup,
	renameStyleGroup,
	getGroupIdByName
} from '../util/styleSync'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		vStyle: {},  // virtual style
		vLayersIndex: {}, // layers index in sync with vStyle.layers

		// {array} GL Style grouped Layers (aka gLayers)
		// array of regular items {object} and/or groups [ {id: 'layerId'}, {id:groupId, children: [{object}, ...]} ]
		vTree: {},
		vTreeIndex: {}, // tree indexes by layerId (see indexTree())

		currentLayerId: null,
		isLoading: false,
		isSaving: false,
		modalProjectsShow: false,
		editorPaneShow: false,
		projectName: '',
		projectId: -1,
		editorMode: 'layer', // layer|style

		mapPopup: {
			features:[],
			point: null,
			show: false
		},
		smartUpdate: [],
		allGroupsOpen: false,
		treeSelected:[]
	},
	getters: {
		getGroupsInfo: state => {
			let names = keys(state.vTreeIndex.__groups);
			let registry = getGroupIdByName(state.vStyle);
			return map(names, name => ({name, id: registry[name]}))
		},
		getPopupFeatures: state => state.mapPopup.features,
		getCurrentLayer: state => state.vLayersIndex[state.currentLayerId],
		getLayer: state => layerId => state.vStyle.layers[state.vLayersIndex[layerId]],
		getLayerIndex: state => layerId => state.vLayersIndex[layerId],
		getLayerByIndex: state => index => state.vStyle.layers[index],
		getTreeIndex: state => layerId => state.vTreeIndex[layerId],
		getTreeItem: state => layerId => {
			let {groupIndex, leafIndex} = state.vTreeIndex[layerId],
				branch = -1=== groupIndex ? state.vTree : state.vTree[groupIndex].children;
			return branch[leafIndex];
		},
		getTreeSelected: state => layerId => !(state.treeSelected.indexOf(layerId) === -1),
		getInitEditorCode: state => (mode = state.editorMode) => (
			mode === 'style'
				? state.vStyle
				: (
					(mode === 'layer' && state.currentLayerId)
					? state.vStyle.layers[state.vLayersIndex[state.currentLayerId]]
					: {id:'none'} // {id: ('new_' + Date.now())}
				)
		)
 	},
	mutations: {
		[types.SET_TREE_ITEM_SELECTED](state, payload) {
			state.treeSelected = payload;
		},
		[types.TOGGLE_TREE_ITEM_SELECTED](state, layerId){
			let index = state.treeSelected.indexOf(layerId);
			if (index === -1) {
				state.treeSelected.push(layerId);
			}
			else {
				state.treeSelected.splice(index, 1);
			}
		},
		[types.SET_ALL_GROUPS_OPEN](state, payload){
			state.allGroupsOpen = payload;
		},

		[types.SET_SMART_UPDATE](state, payload=[]){
			state.smartUpdate = payload;
		},

		[types.SET_MAP_POPUP](state, payload){
			state.mapPopup = {...payload};
		},
		[types.SET_CURRENT_LAYER](state, payload) {
			state.currentLayerId = payload;
		},
		[types.SET_EDITOR_MODE](state, payload) {
			state.editorMode = payload;
		},
		[types.TOGGLE_MODAL](state) {
			state.modalProjectsShow = !state.modalProjectsShow;
		},

		[types.SET_VSTYLE](state, payload) {
			state.vLayersIndex = indexLayers(payload.layers);
			state.vStyle = {...payload};
		},
		[types.SET_STYLE](state, payload) {
			state.vLayersIndex = indexLayers(payload.layers);
			state.vStyle = { ...payload };
			state.vTree = buildTreeData(payload);
			state.vTreeIndex = indexTree(state.vTree);
		},
		
		[types.SET_LAYER](state, {layerId, value}) {
			let index = state.vLayersIndex[layerId];
			state.vStyle.layers.splice(index, 1, value);

			state.vTree = buildTreeData(state.vStyle);
			state.vTreeIndex = indexTree(state.vTree);
		},
		// in case of rename we must re-index with indexLayers()
		[types.RENAME_LAYER](state, {oldLayerId, newLayerId}) {
			let index = state.vLayersIndex[oldLayerId];
			let oldLayer = state.vStyle.layers[index];
			let newLayer = {...oldLayer, id:newLayerId};
			state.vStyle.layers.splice(index, 1, newLayer);
			state.vLayersIndex = indexLayers(state.vStyle.layers);

			state.currentLayerId = newLayerId;

			state.vTree = buildTreeData(state.vStyle);
			state.vTreeIndex = indexTree(state.vTree);
		},

		[types.ADD_LAYER_BEFORE](state, {refLayerId, layer}) {
			// vTree
			let	{groupIndex, leafIndex} = state.vTreeIndex[refLayerId];
			let mirrorSource = groupIndex === -1 ? state.vTree : state.vTree[groupIndex].children;
			let refTreeItem = mirrorSource[leafIndex];
			let newTreeItem = {id: layer.id, icon: refTreeItem.icon, color: refTreeItem.color}

			mirrorSource.splice(leafIndex, 0, newTreeItem);

			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index
			let index = state.vLayersIndex[refLayerId];
			state.vStyle.layers.splice(index, 0, layer);
			state.vLayersIndex = indexLayers(state.vStyle.layers);
		},

		[types.ADD_LAYER](state, {refLayerId, refLayerIndex = 0, layer}) {
			// vStyle and Index
			let index = (refLayerId && state.vLayersIndex[refLayerId]) || refLayerIndex;
			let refLayer = refLayerId && state.vStyle.layers[state.vLayersIndex[refLayerId]];
			let metadata = refLayer && pick(refLayer,'metadata') || {};

			if (!Array.isArray(state.vStyle.layers)) {
				state.vStyle.layers = [];
			}
			state.vStyle.layers.splice(index, 0, {...layer, ...metadata});

			state.vLayersIndex = indexLayers(state.vStyle.layers);

			// vTree
			state.vTree = buildTreeData(state.vStyle);
			state.vTreeIndex = indexTree(state.vTree);
		},

		[types.REMOVE_LAYER](state, layerId){
			let	{groupIndex, leafIndex} = state.vTreeIndex[layerId];
			let mirrorSource = groupIndex === -1 ? state.vTree : state.vTree[groupIndex].children;
			let mirrorTarget = state.vTree;
			let dropCount = groupIndex === -1 ?  0 : ((mirrorSource.length - 1) < 1 ? 1 : 0);

			mirrorSource.splice(leafIndex, 1);
			mirrorTarget.splice(groupIndex, dropCount);

			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index
			let nextStyle = exportStyle(state.vStyle, state.vTree, state.vLayersIndex)
			state.vLayersIndex = indexLayers(nextStyle.layers);
			state.vStyle = {...nextStyle};
		},

		[types.DRAGDROP_LAYER](state, {sourceIndex, sourceGroupIndex, targetIndex, targetGroupIndex}){
			let mirrorSource = sourceGroupIndex === -1 ? state.vTree : state.vTree[sourceGroupIndex].children;
			let mirrorTarget = targetGroupIndex === -1 ? state.vTree : state.vTree[targetGroupIndex].children;

			let isMoveLocalFwd = targetGroupIndex === sourceGroupIndex && sourceIndex < targetIndex;
			targetIndex = targetIndex === -1
				? mirrorTarget.length
				: (isMoveLocalFwd ? targetIndex-1 : targetIndex);

			// vTree
			let mirrorTakeOut = mirrorSource.splice(sourceIndex, 1)[0];
			mirrorTarget.splice(targetIndex, 0, mirrorTakeOut);
			if (mirrorSource.length===0){
				let dropIndex = state.vTree.indexOf(mirrorSource);
				state.vTree.splice(dropIndex, 1);
			}

			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index
			let nextStyle = exportStyle(state.vStyle, state.vTree, state.vLayersIndex)
			state.vLayersIndex = indexLayers(nextStyle.layers);
			state.vStyle = {...nextStyle};
		},

		[types.UNGROUP_LAYER](state, layerId) {
			let	layerIndex = state.vTreeIndex[layerId];

			let sourceIndex = layerIndex.leafIndex;
			let sourceGroupIndex = layerIndex.groupIndex;
			let targetIndex = layerIndex.groupIndex;

			let mirrorSource = state.vTree[sourceGroupIndex].children;
			let mirrorTarget = state.vTree;

			// data mutation
			let dropCount = (mirrorSource.length - 1) < 1 ? 1 : 0;

			let mirrorTakeOut = mirrorSource.splice(sourceIndex, 1)[0];
			mirrorTarget.splice(targetIndex, dropCount, mirrorTakeOut);

			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index
			let nextStyle = exportStyle(state.vStyle, state.vTree, state.vLayersIndex)

			state.vLayersIndex = indexLayers(nextStyle.layers);
			state.vStyle = {...nextStyle};
		},

		[types.GROUP_LAYER](state, layerId) {
			let	{groupIndex, leafIndex} = state.vTreeIndex[layerId];
			// only groupIndex===-1 is supported
			let	branch = -1=== groupIndex ? state.vTree : state.vTree[groupIndex].children;
			let treeItem = branch[leafIndex];

			if (groupIndex !== -1) {
				throw new Error(` (!) descendant ${layerId} of  ${groupIndex} cannot be grouped `);
			}

			let layer = state.vStyle.layers[state.vLayersIndex[layerId]];

			let groupId = '' + Date.now();
			let groupName = `Group: ${layerId}`;

			set(layer, ['metadata', 'mapbox:group'], groupId);

			let index = state.vLayersIndex[layerId];
			state.vStyle.layers.splice(index, 1, layer);

			let vStyle = ensureStyleHasGroup(state.vStyle, {groupName, groupId});
			// console.log(' * ensurehasGroup vStyle : ', vStyle);

			if (vStyle !== state.vStyle) {
				state.vLayersIndex = indexLayers(vStyle.layers);
				state.vStyle = {...vStyle};
			}

			let mirrorTarget = state.vTree;
			let payload = {
				id: groupName,
				children:[treeItem]
			};

			mirrorTarget.splice(leafIndex, 1, payload);

			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index : already set
		},

		[types.MOVE_LAYER_INTO_GROUP](state, {layerId, targetGroup}) {
			let	{groupIndex: sourceGroupIndex, leafIndex:sourceIndex} = state.vTreeIndex[layerId];
			let targetGroupIndex = state.vTreeIndex.__groups[targetGroup.name];
// console.log(' *** sgI, sI, tgI', {sourceGroupIndex, sourceIndex, targetGroupIndex});

			let mirrorSource = sourceGroupIndex === -1 ? state.vTree : state.vTree[sourceGroupIndex].children;
			let mirrorTarget = targetGroupIndex === -1 ? state.vTree : state.vTree[targetGroupIndex].children;
			let targetIndex = mirrorTarget.length;
// console.log(' ### mS, mT, tI', {mirrorSource, mirrorTarget, targetIndex});

			// vTree
			let mirrorTakeOut = mirrorSource.splice(sourceIndex, 1)[0];
			mirrorTarget.splice(targetIndex, 0, mirrorTakeOut);
			if (mirrorSource.length===0){
				let dropIndex = state.vTree.indexOf(  state.vTree[sourceGroupIndex] );
				state.vTree.splice(dropIndex, 1);
			}
			
			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index
			let nextStyle = exportStyle(state.vStyle, state.vTree, state.vLayersIndex)
			state.vLayersIndex = indexLayers(nextStyle.layers);
			state.vStyle = {...nextStyle};

		},

		[types.RENAME_GROUP](state, payload) {
			let vStyle = renameStyleGroup(state.vStyle, payload.prevName, payload.nextName);
			if (!vStyle) return;

			//state.vLayersIndex = indexLayers(payload.layers);
			state.vStyle = { ...vStyle };
			state.vTree = buildTreeData(state.vStyle);
			state.vTreeIndex = indexTree(state.vTree);

		},

		[types.SET_PROJECT_DATA](state, payload) {
			state.projectId = payload.id;
			state.projectName =payload.name;
		},
		[types.SET_LOADING](state, status) {
			state.isLoading = status;
		},
		[types.SET_SAVING](state, status) {
			state.isSaving = status;
		},
		[types.EDITOR_PANE_SHOW](state, payload) {
			state.editorPaneShow = payload;
		}

	}
});
