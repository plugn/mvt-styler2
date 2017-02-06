export function byId (id) {
	return document.getElementById(id);
}
export function byQS (qs) {
	return document.querySelectorAll(qs);
}

export function listFn (nodeList, fn, callback) {
	return Array.prototype[fn].call(nodeList, callback)
}
export function descEl(el) {
	return el && (el.tagName + (el.className ? '.' + el.className : '')) || el;
}
