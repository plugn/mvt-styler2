/**
 * Created by maxd on 27.02.17.
 */
import _ from 'lodash'

export function buildTreeData(mvtStyle) {
	let groupsPath = ['metadata','mapbox:groups'];
	let groupPath = ['metadata','mapbox:group'];
	let currentGroup = null;

	let grouped = _.reduce(mvtStyle.layers, reducer, []);
	console.log('grouped', grouped);
	return grouped;

	function reducer(result, value, key) {
		value.name = value.id || value.name || ('#' + key);

		let thisGroup = _.get(value, groupPath, null);
		if (!thisGroup) {
			result.push(value);
			return result;
		}

		let groupId = _.get(mvtStyle, groupsPath.concat(thisGroup, 'name'), null);
		if (!groupId) { return result; }

		let groupItem;
		if (thisGroup !== currentGroup) {
			currentGroup = thisGroup;
			groupItem = {
				groupId: thisGroup,
				id: groupId,
				name: groupId,
				children: [value]
			};
			result.push(groupItem)
		}
		else {
			groupItem = result[result.length-1];
			groupItem.children.push(value);
		}
		return result;
	}
}