<template>
	<div data-type="modal" class="modal" v-if="show" style="z-index: 200;">
		<div @click.self="toggleShow" class="modal-underlay scroll-v" style="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px;">
			<div class="modal-entity publish-modal space-bottom4 width52 fill-white pin-top">
				<div class="pad2y fill-white"><h3 class="space-bottom2 pad4x">Publish changes to
					North Star</h3>
					<div class="pad4x space-bottom1 quiet small col12 clearfix contain">
						<div class="col6">Published</div>
						<div class="col6 text-right">Draft</div>
					</div>
					<div class="col12 clearfix contain">
						<div class="col12 contain fill-canvas" style="height: 270px;">
CONTENT
						</div>
					</div>
					<div class="col12 clearfix space-top2">
						<div class="center col12 clearfix">
							<button type="button" class="pad2x button short animate stroke quiet button space-right2">
								Publish as new
							</button>
							<button type="button" class="pad4x button short animate fill-cyan button">Publish</button>
						</div>
						<div class="pad4x text-left small quiet space-top1"><strong>Publish</strong>
							 makes your changes visible to your users.
							<strong>Publish as new style</strong> applies
							your changes to a brand new style and preserves the original style.
						</div>
					</div>
				</div>
				<a @click="toggleShow" class="z1 pin-topright pad1 small strong icon close quiet"></a></div>
		</div>
	</div>
</template>

<script>

import * as types from '../../store/mutation-types'
import { mapMutations } from 'vuex';
import storage from '../../util/storage'

export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		model: [Object, Array]
	},

	data() {
		return {
			projects: null
		}
	},

	mounted() {
		storage.getProjects(function(data) {
			console.log(' * getProjects data() : ', data);
			try {
				this.projects = JSON.parse(data.response);
			} catch (e) {
				console.warn(' (!) modal/projects ', e);

			}


		})
	},

	methods: {
		...mapMutations({
			toggleShow: types.TOGGLE_MODAL
		})
	}
}
</script>