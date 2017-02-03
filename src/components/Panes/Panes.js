import resize from '../../directives/resize'
import Tree from '../Tree'
import List from '../List'
import LayerList from '../LayerList/LayerList.vue'
import Editor from '../Editor'

export default {
	components: {
		List,
		LayerList,
		Editor,
		Tree
	},
	directives: {
		resize
	},
	data() {
		return{
		}
	}
}
