<template>

	<li class="col12 clearfix contain dark"
		@click="onClick($event)">
		<ul>
			<div class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark "
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
import {layerRange} from '../../util/styleSync'
import {map} from 'lodash'

export default {
	name: 'ListItem',
	props: {
		model: [Object]
	},
	computed: {
		...mapGetters([
			'getTreeIndex',
			'getTreeSelected'
		]),
		...mapState([
			'currentLayerId',
			'vTree'
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
			setTreeItemSelected: types.SET_TREE_ITEM_SELECTED
		}),

		onClick(e) {
			if (!this.currentLayerId){
				this.setCurrentLayerId(this.model.id);
				return;
			}

			if (!e.shiftKey){
				this.setTreeItemSelected([])
				this.setCurrentLayerId(this.model.id);
				return;
			}

			if (this.currentLayerId === this.model.id) {
				this.setTreeItemSelected([this.model.id]);
				return;
			}
			
			// case with range
			this.setTreeItemSelected([])
			let fromItem = this.getTreeIndex(this.currentLayerId)
			let toItem = this.getTreeIndex(this.model.id)
			if (fromItem.groupIndex !== toItem.groupIndex) {
				return;
			}
			
			let range = layerRange(fromItem.leafIndex, toItem.leafIndex)
			let group = -1=== fromItem.groupIndex ? this.vTree : this.vTree[fromItem.groupIndex].children;

			let selectedLayerIds = map(range, function(layerIndex) {
				return group[layerIndex].id;
			});

			this.setTreeItemSelected(selectedLayerIds);
		}
	}
}
</script>
