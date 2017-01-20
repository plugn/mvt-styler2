<template>
	<div >
		<div class="item" v-resize="{h:false}">Element resizable</div>
		<div class="el-resizer" ref="resizer"></div>

		<div class="item">Block1</div>
		<div class="item">Block2</div>
	</div>
</template>

<style scoped>
.el-resizer {
	background: #eee;
	width: 10px;
	position: static;
	float: left;
	height: 200px;
	cursor: e-resize;
}

div.item {
	position: relative;
	float:left;
	overflow: hidden;
	background: #d0ddd0;
	height: 200px;
	width: 200px;
	user-select: none;
}
</style>

<script>
	import resize from '../directives/resize'
	export default {
		directives: {
			resize
		},
		data() {
			return{
			}
		}

	}

</script>
