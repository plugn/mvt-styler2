// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import TreeItem from './components/TreeItem.vue'
import TreeDragItem from './components/TreeDragItem.vue'

Vue.component('TreeItem', TreeItem);
Vue.component('TreeDragItem', TreeDragItem);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App/>',
	components: {
		App
	}
});
