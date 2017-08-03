import xhr from './xhr';
import {extend} from 'lodash';

function ensureObject(value) {
	return 'string' === typeof value ? JSON.parse(value) : value;
}

function ensureString(value) {
	return 'object' === typeof value ? JSON.stringify(value) : '' + value;
}

const API_HOST = 'http://dev-maps-2.dev.search.km:3000';
// const API_HOST = 'http://styler.km:3000';

let store = {}; // { name: style }
let style;
let styleName = '';
let projectId;
let projectCommit = -1;
let baseProjectPath;

let storage = {
	'set': function _set(contents) {
		style = ensureObject(contents);
	},
	'get': function _get() {
		return style;
	},
	'update': function _update(obj) {
		extend(style, ensureObject(obj));
	},

	// get projects list
	'getProjects': function _getProjects (cb) {
		xhr.get(`${API_HOST}/projects`, null, cb || defaultCallback)
	},

	// create project in storage
	'createProject': function _createProject (name, cb) {
		xhr.post(`${API_HOST}/projects`,
			JSON.stringify({name: name}),
			cb || defaultCallback
		)
	},
	'deleteProject': function _deleteProject(projectId, cb) {
		xhr.delete(`${API_HOST}/projects/${projectId}`,
			null,
			cb || defaultCallback
		);
	},

// let projectId = +req.params.projectId;
// let style = req.body.style;

	'updateStyle': function updateStyle(style, cb) {
		xhr.post(
			baseProjectPath + '/style.json',
			JSON.stringify({style: style}),
			cb || defaultCallback
		)
	},

	'loadStyle': function loadStyle(cb) {
		xhr.get(
			baseProjectPath + '/style.json',
			null,
			cb || defaultCallback
		)
	},

	// to storage
	'save': function _store() {

	},
	// from storage
	'load': function _load() {

	},

	'setProjectId': function (id, commit) {
		if (!id || !isFinite(id)) {
			throw 'invalid project ID';
		}
		projectId = id;
		let path = `${API_HOST}/projects/${projectId}`;
		if (commit && commit != -1) {
			projectCommit = commit;
			path += '/commit/' + commit;
		}
		baseProjectPath = path;
	},

	'setCommit': function (commit) {
		if (!commit || !isFinite(commit)) {
			throw 'invalid commit ID';
		}
		this.setProjectId(projectId, commit);
	}
};

function defaultCallback(o, ctx) {
	if (console && console.log) {
		console.log('xhr.defaultCallback(o) ' + (ctx && ctx || '') + ' : ' , o);
	}
}

export default storage;