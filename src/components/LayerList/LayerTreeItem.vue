<template>
	<ul v-if="isRoot" class="tile__root pin-bottom pin-top space-top7 scroll-styled draghost gu-unselectable micro">
		<LayerTreeItem :model="listItem" :itemIndex="listKey" v-for="(listItem, listKey) in model" :key="listItem.id"></LayerTreeItem>
	</ul>

	<li v-else-if="isFolder" class="tile__folder col12 clearfix contain dark">
		<div class="animate draggable layer-group"
			:class="{'fill-dark': editMode}"
			@mouseenter="hoverFolder=true"
			@mouseleave="hoverFolder=false"
		><a @click="toggle"
				:class="{'caret-right': !open, 'caret-down': open}"
				class="pin-topleft z1 icon pad00y"></a>
			<!--
			<a @click="toggle"
				:class="{'fa-caret-right': !open, 'fa-caret-down': open}"
				class="pin-topleft z1 fa" style="padding-top: 7px; padding-left: 6px;"></a>
		--><div title="Group"
				 class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro">
				<!--<span class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>-->
				<span class="pin-topleft z1 fa fa-20 fa-folder" style="left: 16px; top: 7px;"></span>
				<div @click="toggle"
					 :class="{'pad2r': hoverFolder}"
					 class="pad0x micro" style="padding-left: 27px;">

					<div v-if="editMode" class="contain col12">
						<form v-on:submit.prevent="">
							<button class="pin-right icon check space-right0"
								@click.stop="saveGroup"></button>
							<input type="text"
								   ref="inputGroupId"
								   v-model="modelGroupId"
								   @click.stop=""
								   @keyup.27="editMode=false"
								   @keyup.enter="saveGroup"
								   class="truncate space-right1 micro col12 round shortest clean pad2r ">
						</form>
					</div>
					<div v-else="" class="contain col12 ">
						<div class="truncate layer-folder-title"
							:class="{'space-right2': hoverFolder}"><span data-test="">{{ model.id }}</span><span
								class="quiet space-left0">{{model.children.length}} layers</span>
							<button
								@click.stop="editGroup(model.id)"
								class="pin-topright animate icon pointer"
								:class="{'pencil': hoverFolder}"></button>
						</div>
					</div>

				</div>
				<span class="pin-topright z1 drag-handle animate"></span>
			</div>
		</div>
		<ul v-show="allGroupsOpen || open" class="draghost ">
			<ListGroupItem
					v-for="(listItem, listKey) in model.children"
					:key="listItem.id"
					:model="listItem"
					:itemIndex="listKey"
					:data-group="itemIndex"></ListGroupItem>
		</ul>
	</li>

	<ListItem v-else :model="model"></ListItem>

</template>


<script>
	import {eventBus} from '../../main'
	import ListItem from  './ListItem.vue'
	import ListGroupItem from './ListGroupItem.vue'
	import {get} from 'lodash'
	import * as types from '../../store/mutation-types'
	import {mapMutations, mapState} from 'vuex'

	export default {
		name: 'LayerTreeItem',
		components: {
			ListItem,
			ListGroupItem
		},
		props: {
			model: [Object, Array],
			itemIndex: [Number]
		},

		data() {
			return {
				open: false,
				hoverFolder: false,
				editMode: false,
				prevGroupId: '',
				modelGroupId: ''
			}
		},

		computed: {
			...mapState([
				'allGroupsOpen'
			]),

			isFolder() {
				return this.model.children &&
					this.model.children.length
			},
			isRoot() {
				return Array.isArray(this.model);
			}
		},
		methods: {
			...mapMutations({
				setAllGroupsOpen: types.SET_ALL_GROUPS_OPEN,
				renameGroup: types.RENAME_GROUP
			}),
			toggle() {
				if (this.isFolder) {
					if (this.allGroupsOpen) {
						this.setAllGroupsOpen(false);
						this.open = false;
					}
					else {
						this.open = !this.open;
					}
				}
			},
			editGroup(id) {
				this.editMode = true;
				this.prevGroupId = id;
				this.modelGroupId = id;
				console.log('editGroup', id);

			},
			saveGroup() {
				this.editMode = false;
				console.log('saveGroup', this.prevGroupId, '->', this.modelGroupId);
				this.renameGroup({prevName: this.prevGroupId, nextName: this.modelGroupId});

			}
		}
	}

</script>

<style scoped>
	.tile__root {
		padding-left: .5rem;
	}

</style>