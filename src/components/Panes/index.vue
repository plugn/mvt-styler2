<template>
	<div class="panes">
		<div class="resizable" v-resize="{height:false}">
			<LayerList />

		</div>
		<div class="el-resizer" ref="resizer"></div>
		<div class="pane">
			<Editor />
		</div>
	</div>

</template>

<style lang="scss" src="./Panes.scss" scoped></style>

<script src="./Panes.js"></script>
