<template>
	<editor :content="content" :session="layerId" :lang="lang" :theme="theme" :sync="true" height="100%"></editor>
</template>

<script>
	import editor from './acevue/index'
	import 'brace/mode/json'
	import 'brace/theme/idle_fingers'
	import debounce from 'lodash/debounce'

	import { eventBus } from '../main'
	import * as types from '../store/mutation-types'
	import {mapState, mapMutations} from 'vuex'


	export default{
		data() {
			return {
				layerId: '',
				validContent:'',
				content:'',
				lang:	'json',
				theme:	'idle_fingers',
				onUpdate: function(value) {
					// new session case
					if (value === this.validContent) {
//						console.log('just new session');
						return;
					}

					let code = null;
					try {
						code = JSON.parse(value.replace(/[\t\r\n]|\s{2,}/g, ''));
					} catch (e) {
						console.warn(' (!) JSON crash', e);
					}
					if (code) {
						this.validContent = value;
						if (this.layerId) {
							eventBus.$emit('ace:layer.updated', this.layerId, code);
						}
					}
				}
			}
		},
		components:{
			editor
		},
		created() {
			eventBus.$on('ace:content.set', (value, {layerId, projectId}) => {
				this.layerId = layerId;
				this.projectId = projectId;
				this.validContent = this.content = JSON.stringify(value, null, '\t');
				this.editorPaneShow(true);
			});
		},

		mounted() {
			const vm = this;
			vm.$on('editor-update', debounce(vm.onUpdate, 2500, {trailing: true}));
//			console.log('editor:', editor.methods.getEditor());
			
		},
		methods: {
			...mapMutations({
				editorPaneShow: types.EDITOR_PANE_SHOW
			})
		}


	}

</script>
