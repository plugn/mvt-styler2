/**
 * Created by maxd on 27.02.17.
 */
import _ from 'lodash'

export function buildTreeData(mvtStyle) {
	let groupsPath = ['metadata','mapbox:groups'];
	let groupPath = ['metadata','mapbox:group'];
	let currentGroup = null;

	return _.reduce(mvtStyle.layers, reducer, []);

	function reducer(result, value, key) {
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
				// groupId: thisGroup,
				id: groupId,
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

export function exportLayers(layersTree) {

	return _.reduce(layersTree, reducer, []);

	function reducer(result, value, key) {
		if (_.has(value, 'children')) {
			return _.reduce(value.children, reducer, result)
		}

		result.push(value);

		return result;
	}
}

export function exportStyle(oStyle, layersTree) {
	oStyle.layers = exportLayers(layersTree);
	return oStyle;
}

export function indexLayers(layers) {
	return _.reduce(layers, reducer, {});
	function reducer (result, value, index) {
		result[value.id] = index;
		return result;
	}
}