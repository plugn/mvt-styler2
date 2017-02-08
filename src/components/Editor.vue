<template>
	<editor :content="content" :lang="lang" :theme="theme" :sync="true" height="100%"></editor>
</template>

<script>
	import editor from 'vue2-ace'
	import 'brace/mode/json'
	import 'brace/theme/chrome'
	import { eventBus } from '../main';


	export default{
		data() {
			return {
				content:JSON.stringify({
					poweredBy: 'Vue2Ace'
				}),
				lang: 'json',
				theme: 'chrome',
				onUpdate: function(v) {
					console.log('onUpdate', v)
				}
			}
		},
		components:{
			editor
		},
		mounted () {
			const vm = this;
			vm.$on('editor-update', vm.onUpdate);

			eventBus.$on('ace:content.set', function (value) {
				console.log('$on ace:content.set', value);

				vm.content = value;
			});

		}

	}

</script>
