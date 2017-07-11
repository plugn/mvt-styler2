<template>
	<div id="app">
		<AppLayout />
	</div>
</template>

<script>
	import Panes from './components/Panes/index.vue'
	import AppLayout from './components/AppLayout.vue'

	export default {
		name: 'app',
		components: {
			AppLayout,
			Panes
		},
		data() {
			return {}
		},

	}
</script>

<!--<style src="./assets/flexgrid.css"></style>-->
<!--<style src="normalize.css"></style>-->

<style src="./reset.css"></style>
<style src="./components/FlexLayout.scss"></style>
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
