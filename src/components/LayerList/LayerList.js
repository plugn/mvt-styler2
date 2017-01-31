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
// run();
let listData = [
		{ name: ' ungrouped 1' },
		{ name: ' ungrouped 2' },
		{
			name: '[ group A ]',
			children: [
				{name: ' A item 1' },
				{name: ' A item 2' },
				{name: ' A item 3' },
			]
		},
		{ name: 'ungrouped 3' },
		{
			name: '[ group B ]',
			children: [
				{name: ' B item 1' },
				{name: ' B item 2' },
				{name: ' B item 3' },
			]
		},
		{ name: 'ungrouped 5' },
		{ name: 'ungrouped 7' },
	];
export default {
	components: {
	},

	data() {
		return {
			listData
		}
	},
	methods: {
		isFolder: function (item) {
			return item.children && item.children.length;
		}
	},

}
