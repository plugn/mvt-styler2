<template>
	<div id="app">
		<AppLayout />
		<!--<Panes />-->

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
<style src="./App.css"></style>
