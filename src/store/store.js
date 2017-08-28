import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import {indexLayers, indexTree, buildTreeData} from '../util/styleSync'

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
		modalProjectsShow: false,
		editorPaneShow: false,
		projectName: '',
		projectId: -1
	},
	getters: {
		getCurrentLayer: state => state.vLayersIndex[state.currentLayerId],
		getLayer: state => layerId => state.vStyle.layers[state.vLayersIndex[layerId]],
		getLayerIndex: state => layerId => state.vLayersIndex[layerId],
		getLayerByIndex: state => index => state.vStyle.layers[index],
		getTreeIndex: state => layerId => state.vTreeIndex[layerId]
 	},
	mutations: {
		[types.SET_CURRENT_LAYER](state, payload) {
			state.currentLayerId = payload;
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

		[types.ADD_LAYER_AFTER](state, {refLayerId, value}) {
			let index = state.vLayersIndex[refLayerId];
			state.vStyle.layers.splice(index+1, 0, value);
			state.vLayersIndex = indexLayers(state.vStyle.layers);
		},
		[types.ADD_LAYER_BEFORE](state, {refLayerId, value}) {
			let index = state.vLayersIndex[refLayerId];
			state.vStyle.layers.splice(index, 0, value);
			state.vLayersIndex = indexLayers(state.vStyle.layers);
		},

		[types.SET_PROJECT_DATA](state, payload) {
			state.projectId = payload.id;
			state.projectName =payload.name;
		},
		[types.SET_LOADING](state, status) {
			state.isLoading = status;
		},
		[types.EDITOR_PANE_SHOW](state, payload) {
			state.editorPaneShow = payload;
		}

	}
});