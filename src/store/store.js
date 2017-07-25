import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		vStyle: {},
		gLayers: [],
		currentLayerId: null
	},
	mutations: {
		[types.SET_CURRENT_LAYER](state, payload) {
			state.currentLayerId = payload;
		}
	}
});