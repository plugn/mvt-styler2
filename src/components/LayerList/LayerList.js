import sortable from '../../directives/sortable'
import LayerListItem from './LayerListItem.vue'
import listData from './listData';

export default {

	directives: {
		sortable
	},

	components: {
		LayerListItem
	},

	data() {
		return {
			options: {},
			listData
		}
	},
	methods: {
		isFolder: function (item) {
			return item.children && item.children.length;
		}
	},

}

