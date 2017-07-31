/**
 * HTTP Request wrapper
 * @author Max L Dolgov <bananafishbone@gmail.com>
 *
 * @description created to eliminate CORS preflighted requests
 * @param callback function(xhrResponse) {}
 * @returns {XMLHttpRequest}
 */

function createXHR(callback) {
	let instance = new XMLHttpRequest();
	instance.onreadystatechange = function () {
		if (instance.readyState === XMLHttpRequest.DONE) {
			callback(instance);
		}
	};
	return instance;
}

function xhr(url, data, callback, method) {
	let instance = createXHR(callback);
	method = ('' + method).toUpperCase() || 'GET';
	instance.open(method, url);

	if (method !== 'GET') {
		instance.setRequestHeader('Content-Type', 'application/json');
	}

	instance.send(data || null);
}

['GET','POST','PUT','DELETE'].forEach(
	function iterator(method) {
		let lcMethod = method.toLowerCase();
		xhr[lcMethod] = xhr[method] = function (url, data, callback) {
			return xhr(url, data || '', callback, method);
		};
	}
);

export default xhr;