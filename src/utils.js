import icons from './util/icons.json'
import toColor from '@mapbox/to-color'
import {get} from 'lodash'
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

export function getList(listEl) {
	if (!listEl || !listEl.childNodes) { return; }

	return Array.from(listEl.childNodes).filter(function(node) {
		return node.tagName && !node.hidden;
	});
}

export function icon(type) {
	return icons[type];
}

export function getColor(feature) {
	return toColor(get(feature, 'source-layer'));
}
export function bgColor(feature) {
	let srcLayer = get(feature, 'source-layer')
	let color = toColor(srcLayer);
	return color ? {'backgroundColor': color} : null;
}
