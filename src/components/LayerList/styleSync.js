/**
 * Created by maxd on 27.02.17.
 * style utilities
 */
import {get, has, reduce, keys, difference, pickBy, isEqual, forOwn, omit, map, kebabCase } from 'lodash'


export function buildTreeData(mvtStyle) {
	let groupsPath = ['metadata','mapbox:groups'];
	let groupPath = ['metadata','mapbox:group'];
	let currentGroup = null;

	return reduce(mvtStyle.layers, reducer, []);

	function reducer(result, value, key) {
		let thisGroup = get(value, groupPath, null);
		if (!thisGroup) {
			result.push(value);
			return result;
		}

		let groupId = get(mvtStyle, groupsPath.concat(thisGroup, 'name'), null);
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

	return reduce(layersTree, reducer, []);

	function reducer(result, value, key) {
		if (has(value, 'children')) {
			return reduce(value.children, reducer, result)
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
	return reduce(layers, reducer, {});
	function reducer (result, value, index) {
		result[value.id] = index;
		return result;
	}
}

export function objectDiff(curr, last) {
	let keysLast = keys(last),
		keysCurr = keys(curr),
		dropKeys = difference(keysLast, keysCurr);

	let update = pickBy(curr, function(v, k) {
		// console.log('k,v,last[k] = ' + k + ',' + v + ',' + last[k]);
		return !isEqual(last[k], v);
	});

	return {
		dropKeys,
		update
	};
}


export function updateMapLayer(layerId, params, map) {

	if (has(params, 'minzoom') && has(params, 'maxzoom')) {
		map.setLayerZoomRange(layerId, params.minzoom, params.maxzoom);
	}
	let procParams = omit(params, ['minzoom', 'maxzoom','id', 'metadata']);

	let unhandledParams = {};

	forOwn(procParams, function (value, name) {

//console.log('forOwn', name, '=>', value);
		if ('filter' === name) {
			map.setFilter(layerId, value);
		}
		else if ('layout' === name) {
			forOwn(value, function(v, k){
				map.setLayoutProperty(layerId, k, v);
			});
		} else if ('paint' === name) {
			forOwn(value, function(v, k){
				map.setPaintProperty(layerId, k, v);
			});
		} else {
			unhandledParams[name] = value;
		}


	});

	return unhandledParams;
}

export function prettifyMapLayer(obj) {
	return _.chain(obj)
		.pickBy(function(v, k) {
			let typeOfValue = typeof v;
			return '_' !== k.charAt(0) && 'undefined' !== typeOfValue  && 'function' !== typeOfValue;
		})
		.transform(function(res, v, k){
			return res[kebabCase(k)] = v;
		}, {})
		.value();
}