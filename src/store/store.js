import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import {cloneDeep, get, set, pick} from 'lodash'
import {indexLayers, indexTree, buildTreeData, exportStyle, ensureStyleHasGroup} from '../util/styleSync'

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
		editorMode: 'layer' // layer|style
	},
	getters: {
		getCurrentLayer: state => state.vLayersIndex[state.currentLayerId],
		getLayer: state => layerId => state.vStyle.layers[state.vLayersIndex[layerId]],
		getLayerIndex: state => layerId => state.vLayersIndex[layerId],
		getLayerByIndex: state => index => state.vStyle.layers[index],
		getTreeIndex: state => layerId => state.vTreeIndex[layerId],
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
		},
		// in case of rename we must re-index with indexLayers()
		[types.RENAME_LAYER](state, {oldLayerId, newLayerId}) {
			let index = state.vLayersIndex[oldLayerId];
			let oldLayer = state.vStyle.layers[index];
			let newLayer = {...oldLayer, id:newLayerId};
			state.vStyle.layers.splice(index, 1, newLayer);
			state.vLayersIndex = indexLayers(state.vStyle.layers);

			state.vTree = buildTreeData(state.vStyle);
			state.vTreeIndex = indexTree(state.vTree);
		},

		[types.ADD_LAYER_BEFORE](state, {refLayerId, layer}) {
			// vTree
			let	{groupIndex, leafIndex} = state.vTreeIndex[refLayerId];
			let mirrorSource = groupIndex === -1 ? state.vTree : state.vTree[groupIndex].children;
			mirrorSource.splice(leafIndex, 0, {id: layer.id});

			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index
			let index = state.vLayersIndex[refLayerId];
			state.vStyle.layers.splice(index, 0, layer);
			state.vLayersIndex = indexLayers(state.vStyle.layers);
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
				children:[{
					id: `${layerId}`
				}]
			};

			mirrorTarget.splice(leafIndex, 1, payload);

			// vTree index
			state.vTreeIndex = indexTree(state.vTree);

			// vStyle and Index : already set
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