<template>
	<editor :content="content" :lang="lang" :theme="theme"></editor>
</template>

<script>
	import editor from 'vue2-ace'
	import 'brace/mode/json'
	import 'brace/theme/chrome'

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

		}
	}

</script>
