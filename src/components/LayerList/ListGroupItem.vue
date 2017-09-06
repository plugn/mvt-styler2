
<template>
	<div @click="setCurrentLayerId(model.id)" class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark"
		 :class="{'fill-dark': isCurrent, 'fill-dark2': !isCurrent}"
		 style="padding-left: 20px;">
		<div class="space-top0 space-bottom0 pin-left noevents"
			 style="margin-left: 20px;"
			 :style="{width:'2px', backgroundColor:model.color}"></div>
		<button :title="model.id" :data-test="model.id"
				class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span
				class="icon"
				:class="model.icon"></span>{{ model.id }} </button>
		<div class="pin-right drag-handle animate"></div>
	</div>

</template>

<script>
import {eventBus} from '../../main'
import * as types from '../../store/mutation-types'
import {mapState, mapMutations} from 'vuex'
import ListItem from './ListItem.vue'

export default {
	name:		'ListGroupItem',
	'extends':	ListItem
}
</script>
