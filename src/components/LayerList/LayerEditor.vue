<template>

	<div class="contain pin-left width40 flex" v-resize="{height:false}" data-handle="layers-resizer">
		<div class="contain pin-left col12 flex-column flex shadow dark fill-dark">

			<div class="contain small clearfix fill-lighten0">
				<div class="pad1x pad0y">
					<div class="col12 contain" data-test="layer-name">
						<div class="space-top0 space-bottom0 pin-left noevents"
							 style="width: 2px; background: rgba(255, 204, 68, 0.75);"></div>
						<div class="strong small pin-topleft pad0 icon line"></div>
						<div class="strong space-left3">
							<div class="contain col12 pointer">
								<div class="small pad0y truncate space-right2 strong"><span data-test="layer-name-text" >{{codeTitle}}</span>
									<button data-test="trigger-layer-rename"
											class="a pin-right pad0y icon pencil show-in-hover animate"></button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="keyline-bottom pin-bottom keyline-lighten0 space-left1 space-right1"></div>
			</div>
			<div class="fill-lighten0 pad1x col12 micro strong">
				<button data-test="style-tab-button"
						class="a icon brackets inline animate pad0 keyline-bottom  active keyline-white"
						style="padding-bottom: 4px;">Code
				</button>
				<span class="space-left0">
					<button data-test="data-tab-button" class="a icon paint inline animate pad0 keyline-bottom keyline-transparent"
							style="padding-bottom: 4px;">Style</button>
				</span></div>
			<div class="scroll-styled pin-left col12 space-top7">
				<Editor class="body"></Editor>
			</div>
		</div>
		<div class="resizer" ref="layers-resizer"></div>

	</div>
</template>

<script>
	import {eventBus} from '../../main'
	import * as utils from '../../utils'
	import LayerTree from '../LayerList/LayerTree.vue'
	import Editor from '../Editor.vue'
	import resize from '../../directives/resize/resize'
	import {mapState, mapGetters} from 'vuex'

	export default {
		name: 'LayerEditor',

		components: {
			Editor
		},
		directives: {
			resize
		},
		data() {
			return {
				codeTitle: '?'
			}
		},
		computed: {
			...mapState([
				'currentLayerId'
			]),
			...mapGetters([
				// 'getCurrentLayer',
				'getLayer'
			])
		},

		watch: {
			currentLayerId: function(layerId) {
				if (!layerId) { return; }

				let data = this.getLayer(layerId);
//				console.log(' * LayerEditor watch() '+layerId+' data : ', data);
				eventBus.$emit('ace:content.set', data, {layerId});
				this.codeTitle = layerId || this.codeTitle;
			}
		},

		methods: {
			onAfterResize: function() {
				eventBus.$emit('map:resize');
			}
		}
	}

</script>
