<template>
	<div>
		<draggable :list="list1" :options="{group:'people'}" @start="drag=true" @end="drag=false">
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
