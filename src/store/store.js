import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		vStyle: {},
		gLayers: [],

		currentLayerId: null,
		modalProjectsShow: false
	},
	mutations: {
		[types.SET_CURRENT_LAYER](state, payload) {
			state.currentLayerId = payload;
		},
		[types.TOGGLE_MODAL](state) {
			state.modalProjectsShow = !state.modalProjectsShow;
		}
	}
});