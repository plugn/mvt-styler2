<template>
	<editor :content="content" :lang="lang" :theme="theme" :sync="true" height="100%"></editor>
</template>

<script>
	import editor from 'vue2-ace'
	import 'brace/mode/json'
	import 'brace/theme/chrome'
	import 'brace/theme/idle_fingers'
	import debounce from 'lodash/debounce'

	import { eventBus } from '../main';


	export default{
		data() {
			return {
				initialContent:'',
				content:'',
				lang:	'json',
				theme:	'idle_fingers',
				onUpdate: function(value) {
					// new session case
					if (value === this.content) {
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
						this.content = value;
						console.log('edited', code);
					}
				}
			}
		},
		components:{
			editor
		},
		created() {
			eventBus.$on('ace:content.set', (value) => {
				this.initialContent = this.content = JSON.stringify(value, null, '\t');
			});
		},

		mounted() {
			const vm = this;
			vm.$on('editor-update', debounce(vm.onUpdate, 1200));
		}

	}

</script>
