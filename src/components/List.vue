<template>
	<div>
		<draggable :list="list1" :options="stOptions" @start="drag=true" @end="drag=false"  :move="onMove">
			<div v-for="element in list1">{{element.name}}</div>
		</draggable>
	</div>
</template>
<style>
</style>
<script>
	import draggable from 'vuedraggable'

	export default {
		data() {
			return {
				stOptions: {
					group: 'people',
				},
				onMove: function (/**Event*/evt, /**Event*/originalEvent) {
					// Example: http://jsbin.com/tuyafe/1/edit?js,output
					console.log('evt', evt.dragged.textContent, ' -> ', evt.related.textContent);

//						evt.dragged; // dragged HTMLElement
//						evt.draggedRect; // TextRectangle {left, top, right и bottom}
//						evt.related; // HTMLElement on which have guided
//						evt.relatedRect; // TextRectangle
					// originalEvent.clientY; // mouse position
					// return false; — for cancel
				},

				list1: [
					{
						name: "John"
					},
					{
						name: "Joao"
					},
					{
						name: "Jean"
					},
					{
						name: "Juan"
					},
					{
						name: "Edgard"
					},
					{
						name: "Johnson"
					}
				]
			}
		},
		components: {
			draggable
		}
	}

</script>
