<template>
	<editor :content="content" :lang="lang" :theme="theme" :sync="true" height="100%"></editor>
</template>

<script>
	import editor from 'vue2-ace'
	import 'brace/mode/json'
	import 'brace/theme/chrome'
	import 'brace/theme/idle_fingers'

	import { eventBus } from '../main';


	export default{
		data() {
			return {
				content:JSON.stringify({
					poweredBy: 'Vue2Ace'
				}),
				lang: 'json',
				theme: 'idle_fingers',
				onUpdate: function(v) {
//					let j = (v.replace(/[\t\r\n]|\s{2,}/g, ''));
//					console.log('onUpdate()', j);
				}
			}
		},
		components:{
			editor
		},
		created() {
			eventBus.$on('ace:content.set', (value) => {
//				console.log('$on ace:content.set', value);
				this.content = value;
			});
		},

		mounted() {
			const vm = this;
			vm.$on('editor-update', vm.onUpdate);
		}

	}

</script>
