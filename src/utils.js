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
