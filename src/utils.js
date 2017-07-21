/**
 * moves element from fromIndex and place it at toIndex in given list
 * @param list {Array}
 * @param fromIndex
 * @param toIndex
 * @returns {Array}
 */
export function moveArrayItem(list, fromIndex, toIndex) {
	list.splice(toIndex, 0, list.splice(fromIndex, 1)[0]);
	return list;
}
export function byQS (qs, ctx) { return (ctx || document).querySelectorAll(qs); }

export function listFn (nodeList, fn, arg) {
	return Array.prototype[fn].call(nodeList, arg);
}

export function getList(listEl) {
	if (!listEl || !listEl.childNodes) { return; }
	return listFn(listEl.childNodes, 'filter', function(node) {
		return node.tagName && !node.hidden;
	});
}
