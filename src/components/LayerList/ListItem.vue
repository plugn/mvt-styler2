<template>

	<li class="col12 clearfix contain dark"
		@click="setCurrentLayerId(model.id)">
		<ul>
			<div class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark "
				 @click.shift="toggleMeta()"
				 :class="{'fill-dark': isCurrent, 'fill-dark2': !isCurrent, 'fill-lighten1':isSelected}"
				 style="padding-left: 10px;">
				<div class="space-top0 space-bottom0 pin-left noevents space-left1"
					 :style="{width:'2px', backgroundColor:model.color}"></div>
				<button  :title="model.id" :data-test="model.id" class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span
						class="icon" :class="model.icon"></span>
					{{ model.id }}
				</button>
				<div class="pin-right drag-handle animate"></div>
			</div>
		</ul>
	</li>

</template>

<script>
import {eventBus} from '../../main'
import * as types from '../../store/mutation-types'
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
	name: 'ListItem',
	props: {
		model: [Object]
	},
	computed: {
		...mapGetters([
			'getTreeSelected'
		]),
		...mapState([
			'currentLayerId'
		]),
		isCurrent() {
			return this.model.id === this.currentLayerId
		},
		isSelected() {
			return this.getTreeSelected(this.model.id)
		}
	},
	methods: {
		...mapMutations({
			setCurrentLayerId:		types.SET_CURRENT_LAYER,
			toggleTreeItemSelected:	types.TOGGLE_TREE_ITEM_SELECTED,
		}),
		toggleMeta() {
			this.toggleTreeItemSelected(this.model.id)
		}
	}
}
</script>
