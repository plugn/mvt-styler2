
<template>
	<div @click="tweakLayer(model.id)" class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark fill-dark2  "
		 style="padding-left: 20px;">
		<div class="space-top0 space-bottom0 pin-left noevents"
			 style="margin-left: 20px; width: 2px; background: rgba(255, 153, 119, 0.75);"></div>
		<button title="admin_country" data-test="layer_item-admin_country"
				class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span
				class="line icon inline" ></span>{{ model.id }} {{ isCurrent ? ' * ' : ''}}</button>
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
