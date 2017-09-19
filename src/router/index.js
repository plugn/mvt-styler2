import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import NewLayout from '../components/NewLayout.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/new',
			name: 'new',
			component: NewLayout
		},
		{
			path: '/',
			name: 'app',
			component: AppLayout
		}
	]
})
