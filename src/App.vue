<template>
	<div id="app">
		<Panes/>
	</div>
</template>

<script>
	import List from './components/List'
	import Editor from './components/Editor'
	import Panes from './components/Panes/index.vue'


	export default {
		name: 'app',
		components: {
			Panes
		},
		data(){
			return {
				msg: '{"id":"MVT1"}'
			}
		},

	}
</script>

<!--<style src="./assets/flexgrid.css"></style>-->
<style src="normalize.css"></style>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: initial;
		position: absolute;
		height: 100%;
		width: 100%;
	}
</style>
