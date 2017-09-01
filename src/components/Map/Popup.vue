<template>
	<div v-show="model && model.length" class="width16 map-popup pin-topleft" style="position: fixed;"
		:style="{top: point && point.y+'px' || '0', left: point && point.x+'px' || '0'}">
		<div class="round shadow scroll-styled dark fill-dark2" style="max-height: 180px;">
			<a  v-for="feature in model" :key="feature.id"
				class="pad0x pad00y contain micro block truncate quiet" href="/edit/">
				<div class="space-left0 space-top0 space-bottom0 pin-left noevents" style="width: 2px; background: rgba(204, 255, 238, 0.75);"></div>
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
	import {mapState} from 'vuex'

	export default {
//		props: {
//			point: [Object],
//			model: [Object, Array]
//		},
		computed:{
			...mapState({
				model: state => state.mapPopup.features,
				point: state => state.mapPopup.point
			})
		},
//		mounted:{},
		methods:{
			icon(type) {
				return icons[type];
			}

		}
	}
</script>