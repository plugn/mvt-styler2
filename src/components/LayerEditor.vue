<template>

	<div class="contain pin-left width40 flex" v-resize="{height:false}" data-handle="layers-resizer">
		<div class="contain pin-left col12 flex-column flex shadow dark fill-dark">

			<div class="contain small clearfix fill-lighten0">
				<div class="pad1x pad0y">
					<div class="col12 contain" data-test="layer-name">
						<div class="space-top0 space-bottom0 pin-left noevents"
							 :style="[{width:'2px'}, bgColor(layer)]"></div>
						<div class="strong small pin-topleft pad0 icon "
							 :class="layer && (icon(layer.type) || 'return')"></div>
						<div class="strong space-left3">
							<div v-if="editMode" class="contain col12">
								<form v-on:submit.prevent="">
									<button data-test="confirm-rename-layer"
											@click="saveId"
											class="a pad0y pin-right icon check space-right0"></button>
									<input type="text"
										   ref="inputCodeTitle"
										   :value="codeTitle"
										   @keyup.enter="saveId"
										   @keyup.27="editMode=false"
										   @blur="onEditBlur"
										   class="truncate clean small short col12 space-right2 round "
										   style="padding-right: 20px;"
									>
								</form>
							</div>

							<div v-else="" class="contain col12 pointer">
								<div class="small pad0y truncate space-right2 strong"><span data-test="layer-name-text">{{codeTitle}}</span>
									<button data-test="trigger-layer-rename"
											@click="editId"
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
						class="a icon brackets inline animate pad0 keyline-bottom keyline-transparent"
						:class="{'active keyline-white': (editorMode === 'layer'), 'dim noevents': !currentLayerId}"
						@click="setEditorValue('layer')"
						style="padding-bottom: 4px;">Layer
				</button>
				<span class="space-left0">
					<button data-test="data-tab-button"
							class="a icon paint inline animate pad0 keyline-bottom keyline-transparent"
							:class="{'active keyline-white': (editorMode === 'style')}"
							@click="setEditorValue('style')"
							style="padding-bottom: 4px;">Style</button>
				</span>
			</div>
			<div class="scroll-styled pin-left col12 space-top7">
				<Editor class="body"></Editor>
			</div>
		</div>
		<div class="resizer" ref="layers-resizer"></div>

	</div>
</template>

<script>
	import {eventBus} from '../main'
	import LayerTree from './LayerList/LayerTree.vue'
	import Editor from './Editor.vue'
	import resize from '../directives/resize/resize'
	import * as types from '../store/mutation-types'
	import {mapMutations, mapState, mapGetters} from 'vuex'
	import {icon, bgColor} from '../utils'

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
				codeTitle: '?',
				layer: null,
				editMode: false
			}
		},
		computed: {
			...mapState([
				'currentLayerId',
				'vTree',
				'editorMode'
			]),
			...mapGetters([
				'getInitEditorCode',
				'getLayer'
			])
		},

		watch: {
			currentLayerId: function (layerId) {
				if (!layerId) {
					if (this.editorMode==='layer') {
						this.editorPaneShow(false);
					}
					return;
				}

				this.setEditorMode('layer');

				this.layer = this.getLayer(layerId);
//				console.log(' * LayerEditor watch() '+layerId+' layer : ', this.layer, ' editorMode', this.editorMode);
				eventBus.$emit('ace:content.set', this.getLayer(layerId));
				this.codeTitle = layerId || this.codeTitle;

			}
		},

		methods: {
			icon,
			bgColor,

			...mapMutations({
				setEditorMode: types.SET_EDITOR_MODE,
				renameLayer: types.RENAME_LAYER,
				editorPaneShow: types.EDITOR_PANE_SHOW
			}),

			setEditorValue(mode) {
				let code = this.getInitEditorCode(mode);
				if (!code) {
					console.warn('setEditorValue() code \n', code);
					return;
				}

				eventBus.$emit('ace:content.set', code);
				this.setEditorMode(mode);

			},
			onAfterResize: function () {
				eventBus.$emit('map:resize');
			},
			saveId() {
				console.log('saveId', this.codeTitle, '->', this.$refs.inputCodeTitle.value);
				let value = this.$refs.inputCodeTitle.value;
				this.editMode = false;
				this.codeTitle = value;
				this.renameLayer({oldLayerId: this.currentLayerId, newLayerId: value});
			},
			editId() {
				this.editMode = true;
			},
			onEditBlur() {
				const vm = this;
				setTimeout(function() {
					vm.editMode = false;
				}, 300);
			}
		}
	}

</script>
