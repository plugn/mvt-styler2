<template>
	<div v-show="model && model.length" class="width16 map-popup pin-topleft" style="position: absolute;"
		:style="{top: point && point.y+'px' || '0', left: point && point.x+'px' || '0'}">

		<div class="round shadow scroll-styled dark fill-dark2" style="max-height: 180px;">
			<a  v-for="feature in model" :key="feature.id"
				@click.prevent="setCurrentLayerId(feature.layer.id)"
				class="pad0x pad00y contain micro block truncate quiet">
				<div class="space-left0 space-top0 space-bottom0 pin-left noevents"
					:style="[{width:'2px'}, bgColor(feature.layer)]"
				></div>
				<span class="space-left0 inline icon"
					  :class="icon(feature.layer.type)"></span>
				{{feature.layer.id}}
			</a>
		</div>
		<div class="map-popup-nub"></div>
	</div>
</template>

<script>
	import icons from '../../util/icons.json'
	import toColor from '@mapbox/to-color'
	import * as types from '../../store/mutation-types'
	import {mapState, mapMutations} from 'vuex'
	import {get} from 'lodash'

	export default {
		computed:{
			...mapState({
				model: state => state.mapPopup.features,
				point: state => state.mapPopup.point
			})
		},
		methods:{
			...mapMutations({
				setCurrentLayerId: types.SET_CURRENT_LAYER
			}),
			icon(type) {
				return icons[type];
			},
			bgColor(feature) {
				let srcLayer = get(feature, 'source-layer')
				let color = toColor(srcLayer);
				return color ? {'backgroundColor': color} : null;
			}

		}
	}
</script>