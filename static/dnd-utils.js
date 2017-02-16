
function byId (id) { return document.getElementById(id); }
function byQS (qs) { return document.querySelectorAll(qs); }
function listFn (nodeList, fn, arg) {
	return Array.prototype[fn].call(nodeList, arg)
}

function throttle (fn, time, context) {
	var lock, args, wrapperFn, later;

	later = function () {
		// reset lock and call if queued
		lock = false;
		if (args) {
			wrapperFn.apply(context, args);
			args = false;
		}
	};

	wrapperFn = function () {
		if (lock) {
			// called too soon, queue to call later
			args = arguments;

		} else {
			// call and lock until later
			fn.apply(context, arguments);
			setTimeout(later, time);
			lock = true;
		}
	};

	return wrapperFn;
}

function getOffset(e) {
	var target = e.target || e.srcElement,
		rect = target.getBoundingClientRect(),
		offsetX = e.clientX - rect.left,
		offsetY = e.clientY - rect.top;

	return [offsetX, offsetY];
}
