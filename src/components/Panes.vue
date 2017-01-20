<template>
	<div class="panes">
		<div class="item pane-right">
			<List />
		</div>
		<div class="item pane-left" v-resize="{h:false}">
			<Editor />
			<div class="el-resizer" ref="resizer"></div>
		</div>



	</div>
</template>

<style scoped>
.panes {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}
.el-resizer {
	position: absolute;
	background: #ccc;
	width: 10px;
	right: 0;
	height: 100%;
}
/*
	position: relative;
	float:left;
*/
div.item {
	overflow: hidden;
	background: #eee;
	user-select: none;
	height: 100%;
}

.pane-left {
	position: absolute; top:0; left:0; right:50%;bottom:0;
}
.pane-right {
	position: absolute; top:0; left:50%; right:0; bottom:0;
}


</style>

<script>
import resize from '../directives/resize'
import List from './List'
import Editor from './Editor'

	export default {
		components: {
		    List,
		    Editor
		},
		directives: {
			resize
		},
		data() {
			return{
			}
		}

	}



</script>
