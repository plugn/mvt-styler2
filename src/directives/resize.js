import _ from 'lodash';

export default {

	inserted (element, binding, vnode) {
		// console.log('inserted', element, 'binding', binding, refs.resizer);
		let resizer = vnode.context.$refs.resizer;
		let resizeWidth = _.get(binding, 'value.w', true) !== false;
		let resizeHeight = _.get(binding, 'value.h') !== false;
		let resizeDirection = '' + (resizeHeight ? 's' : '') + (resizeWidth ? 'e' : '');

		if (resizeDirection) {
			resizer.style.cursor = resizeDirection + '-resize';
		}

		resizer.addEventListener('mousedown', initResize, false);

		function initResize(e) {
			window.addEventListener('mousemove', resize, false);
			window.addEventListener('mouseup', stopResize, false);
		}

		function resize(e) {
			if (resizeWidth) {
				element.style.width = (e.clientX - element.offsetLeft) + 'px';
			}
			if (resizeHeight) {
				element.style.height = (e.clientY - element.offsetTop) + 'px';
			}
		}

		function stopResize(e) {
			window.removeEventListener('mousemove', resize, false);
			window.removeEventListener('mouseup', stopResize, false);
		}
	}

}

