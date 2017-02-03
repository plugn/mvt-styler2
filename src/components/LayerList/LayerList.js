import sortable from '../../directives/sortable'
import listData from './listData';

export default {
	directives: {
		sortable
	},

	data() {
		return {
			options: {filter: '.filtered'},
			listData
		}
	},
	methods: {
		isFolder: function (item) {
			return item.children && item.children.length;
		}
	},

}

function byId (id) {
	return document.getElementById(id);
}
function byQS (qs) {
	return document.querySelectorAll(qs);
}

function listFn (nodeList, fn, callback) {
	return Array.prototype[fn].call(nodeList, callback)
}
function descEl(el) {
	return el && (el.tagName + (el.className ? '.' + el.className : '')) || el;
}
function onMove( evt, originalEvent) {
	let drag = evt.dragged,
		rel = evt.related;
	// console.log('$'+descEl(drag) +'\n -> '+ descEl(rel));
	if (drag.matches('.tile__folder') && !rel.parentNode.matches('.tile__root')) {
		return false;
	}
}

function run() {
	listFn(byQS('.tile__folder'), 'forEach', function(f) {
		f.addEventListener('click', function(e){
			e.target.closest('.tile__folder').classList.toggle('collapsed');
		});
	});

	// Multi groups
	Sortable.create(byId('multi'), {
		animation: 150,
		draggable: '.tile',
		handle: '.tile__name',
		onMove: onMove,
		group: 'photo'
	});

	let lists = byQS('#multi .tile__list');
	listFn(lists, 'forEach', function(el) {
		Sortable.create(el, {
			group: 'photo',
			onMove: onMove,
			animation: 150
		});
	});

	listFn(byQS('#multi'), 'forEach', function(el) {
		Sortable.create(el, {
			group: 'photo',
			draggable: 'li',
			onMove: onMove,
			animation: 150
		});
	});






}
