// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import router from './router'
import { sync } from 'vuex-router-sync'

export const eventBus = new Vue();

const unsync = sync(store, router) // done. Returns an unsync callback fn

/* eslint-disable no-new */
new Vue({
	el: '#app',
	store,
	router,
	template: '<App/>',
	components: {
		App
	}
});
