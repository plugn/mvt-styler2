<template>

	<li class="col12 clearfix contain dark" @click="tweakLayer(model.id)">
		<ul>
			<div class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark fill-dark2  " style="padding-left: 10px;">
				<div class="space-top0 space-bottom0 pin-left noevents space-left1" style="width: 2px; background: rgba(255, 68, 85, 0.75);"></div>
				<button title="country_label" data-test="layer_item-country_label" class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span class="transform-uppercase icon inline"></span>
					{{ model.id }}
				</button>
				<div class="pin-right drag-handle animate"></div>
			</div>
		</ul>
	</li>

</template>

<script>
import {eventBus} from '../../main'

export default {
	name: 'ListItem',
	props: {
		model: [Object],
	},
	methods: {
		tweakLayer(layerId) {
			this.$store.commit('activeLayerId', layerId);
			eventBus.$emit('tweakLayer', layerId);
		}
	}
}
</script>
