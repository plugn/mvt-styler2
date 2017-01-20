<template>
	<div>
		<div class="item" v-resize="">Element resizable</div>
		<div class="el-resizer"></div>

		<div class="item">Block1</div>
		<div class="item">Block2</div>
	</div>
</template>

<style>
.el-resizer {
	background: #eee;
	width:5px;
	position: static;
	float: left;
	height: 200px;
	cursor: e-resize;
}

div.item {
	position: relative;
	float:left;
	overflow: hidden;
	background: blue;
	height: 200px;
	width: 200px;
}
/*
#element {
	position: relative;
	overflow: hidden;
	background: green;
	height: 200px;
	width: 200px;
}
*/
</style>

<script>
	import VResize from './v-resize'
	export default{
		directives: {
			'resize':VResize
		},

		data(){
			return{
			}
		}

	}

</script>
