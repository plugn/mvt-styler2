<template>
	<div data-type="modal" class="modal" v-if="show" style="z-index: 200;">
		<div @click.self="toggleShow" class="modal-underlay scroll-v" style="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px;">
			<div class="modal-entity publish-modal space-bottom4 width52 fill-white pin-top contain">
				<div class="pad4x space-top2 space-bottom2 prose-big">Projects</div>
				<div class="pad4x space-bottom3">
					<div  v-for="proj in projects" class="keyline-bottom">
						<div class="clearfix small pointer toggle-sibling">
							<div class="pad1y contain">
								<a class="rcon pin-right pad1y dark-link caret-right"></a>
								<span class="code strong strong truncate">{{proj.name}}</span>
								<!--<span class="quiet code space-right2">#{{proj.id}}</span>-->
							</div>
						</div>
					</div>
				</div>
				<a @click="toggleShow" class="z1 pin-topright pad1 small strong icon close quiet"></a>
			</div>
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
		storage.getProjects(data => this.setProjects(data))
	},

	methods: {
		...mapMutations({
			toggleShow: types.TOGGLE_MODAL
		}),
		setProjects(data){
			try {
				this.projects = JSON.parse(data.response);
				console.log(' * setProjects data() : ', this.projects);
			} catch (e) {
				console.warn(' (!) modal/projects ', e);
			}
		}
	}
}
</script>