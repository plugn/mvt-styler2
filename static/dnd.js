

var dragged = null,
	ghostEl = null,
	counter = 0;

function initDnD() {
	dragged = null;
	ghostEl = null;
	console.clear();
	console.log('='.repeat(64));

	listFn(byQS('#app li'), 'forEach', function(li){
		li.draggable = true;
		li.dataset.value = ''+(counter++)+'@'+li.innerText;
	});

	var rootEl = document.querySelector('#app > ul');
	rootEl.addEventListener('dragstart', onDragStart, false)
	rootEl.addEventListener('dragend', onDragEnd, false)

	rootEl.addEventListener('dragover',
		onDragOver,
		false);
	rootEl.addEventListener('drop', onDrop, false);
}

function onDragStart(e) {
	dragged = e.target;
	ghostEl = getGhost();
	e.dataTransfer.setData('text/plain', '');
	console.log('dragstart', e.target.dataset.value);
}

// TODO: hide source draggable when dragging
function onDragOver(e) {
	e.stopPropagation();
	e.preventDefault();


	if (e.target.draggable) {
		var refNode = findRefNode(e);
		if (!dragged || !_.get(e, 'target.parentNode')) { return; }
		if (ghostEl && ghostEl.parentNode) {
			//  ghostEl.parentNode.removeChild(ghostEl);
		}
		try {
			e.target.parentNode.insertBefore(g, refNode);
		} catch (error) {
			console.log('pN', e.target.parentNode, 'g', g);
		}
	}
}

function onDragEnd(e) {
	console.log('onDragEnd ghost', ghostEl, 'parent', ghostEl && ghostEl.parentNode);
//   if (ghostEl && ghostEl.parentNode) {
//     ghostEl.parentNode.removeChild(ghostEl);
//   }
	dragged = null;
	// ghostEl = null;
}

function onDrop(e) {
	// TODO
	// from: id, parentId
	// to: [ parentId? ]id

	console.log('drop. dragged:', dragged.dataset.value);
	if (!e.target.dataset.value) {
		var parentLi = e.target.closest('li'),
			ul = parentLi && parentLi.querySelector('ul');
		if (ul) {
			console.log('ul', ul);
		}
	} else {
		calcPos(e);

		///////////////////
		if (ghostEl && ghostEl.parentNode) {
			ghostEl.parentNode.removeChild(ghostEl);
		}

	}

}

function findRefNode(e) {
	if (dragged && e.target === dragged) { return; }
	var ctxBox = e.target.getBoundingClientRect();
	var offset = getOffset(e);
	console.log()
	console.log('findRefNode', e.target.dataset.value, 'boxH', ctxBox.height, 'offset: ', offset[0]+','+offset[1]);
	return (offset[1] < ctxBox.height / 2) ? e.target : null;
}


// onDragEnter, onDragLeave
function getGhost() {
	if (!dragged) { return; }
	if (ghostEl) { return ghostEl; }
	ghostEl = dragged.cloneNode(true);
	ghostEl.draggable = null;
	ghostEl.style.opacity = '0.5';
	return ghostEl;

}

function calcPos(e) {
	var ghost = getGhost();
	var targetIndex = ghost && getItemIndex(ghost);
	console.log('calcPos() targetIndex', targetIndex, getList(e.target));
}

function getList(el) {
	return listFn(el.parentNode.childNodes, 'filter', function(node){
		return node.tagName;
	});
}

function getItemIndex(el) {
	// target node index inside it's parent
	var targetList = getList(el);
	return listFn(targetList, 'indexOf', el);
}

document.addEventListener('DOMContentLoaded', initDnD);













