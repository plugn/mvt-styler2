<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	import AppLayout from './components/AppLayout.vue'

	export default {
		name: 'app',
		components: {
			AppLayout
		},
		data() {
			return {}
		},

	}
</script>

<style src="./reset.css"></style>
<style src="./FlexLayout.scss"></style>
<style src="./App.css"></style>
