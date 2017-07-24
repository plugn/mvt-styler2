import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		vStyle: {},
		gLayers: [],
		activeLayerId: 5,
	},
	getters: {
		activeLayerId(state) {
			return state.activeLayerId;
		}
	},
	mutations: {
		activeLayerId(state, payload) {
			state.activeLayerId = payload;
			console.log('payload', payload);
			
		}
	}
});