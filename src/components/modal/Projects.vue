<template>
	<div data-type="modal" class="modal" v-if="show" style="z-index:200;">
		<div @click.self="toggleShow" class="modal-underlay scroll-v" style="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px;">
			<div class="modal-entity publish-modal space-bottom4 width52 fill-white pin-top contain">
				<div class="pad4x space-top2 space-bottom2 prose-big">Projects</div>
				<div class="pad4x col12 clearfix space-bottom3 scroll-styled scroll-v" style="max-height: 360px;">
					<div v-for="proj in projects" class="keyline-bottom">
						<div @click="setProject({id:proj.id, name:proj.name})" class="clearfix small pointer toggle-sibling">
							<div class="pad1y contain">
								<a class="rcon pin-right pad1y dark-link caret-right"></a>
								<span class="code strong strong truncate">{{proj.name}}</span>
								<!--<span class="quiet code space-right2">#{{proj.id}}</span>-->
							</div>
						</div>
					</div>
				</div>
				<div class="col12 clearfix space-top2 space-bottom2">

					<div class="pad4x col12 clearfix fill">
						<div class="strong small x-width10 contain">
							<div class="contain col3  pad0y">
								New Project
							</div>
							<div class="contain col9 pointer">
								<button @click="createProject" class="a pad0y pin-right icon plus-document space-right0"></button>
								<input type="text" value="" placeholder="name"
									   @keyup.27="escapeNewProject"
									   @keyup.enter="createProject"
									   v-model="newProjectName"
									   class="truncate x-clean small short col12 space-right2 round "
									   style="padding-right: 20px;"
								>
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
			projects: null,
			newProjectName: ''
		}
	},

	mounted() {	
		this.getProjects();
	},

	methods: {
		...mapMutations({
			toggleShow: types.TOGGLE_MODAL,
			setProject: types.SET_PROJECT_DATA
		}),
		getProjects() {
			storage.getProjects(data => this.setProjects(data))
		},
		setProjects(data){
			try {
				this.projects = JSON.parse(data.response);
				console.log(' * setProjects data() : ', this.projects);
			} catch (e) {
				console.warn(' (!) modal/projects ', e);
			}
		},
		createProject() {
			console.log('createProject()');
			let name = this.newProjectName;
			if (!name) { return; }
			
			storage.createProject(name, (xhr) => {
				console.log('createProject', xhr, '/n this: ', this);
				this.newProjectName = '';
				this.getProjects();
			})
		},
		escapeNewProject(e){
			this.newProjectName='';
			console.log('escaped', this.newProjectName);
			
		},
	}
}
</script>