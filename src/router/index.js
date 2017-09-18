import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import NextLayout from '../components/NextLayout.vue'

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '',
			name: 'AppLayout',
			component: AppLayout
		},
		{
			path: '/',
			name: 'AppLayout',
			component: AppLayout
		},
		{
			path: '/next',
			name: 'NextLayout',
			component: NextLayout
		}
	]
})
