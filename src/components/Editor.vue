<template>
	<editor :content="content" :lang="lang" :theme="theme"></editor>
</template>

<script>
	import editor from 'vue2-ace'
	import 'brace/mode/json'
	import 'brace/theme/chrome'
	// import _ from 'lodash'

	// console.log('lodash', _.identity)
	export default{
		data() {
			return {
				content:JSON.stringify({
					comp: 'Vue2Ace'
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
