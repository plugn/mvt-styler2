import _ from 'lodash';

export default {

	inserted (element, binding, vnode) {
		// console.log('inserted', element, 'binding', binding, refs.resizer);
		let handleRef = element.dataset.handle;
		if (!handleRef) {
			throw new Error('(!) handleRef: ', handleRef);
		}

		let resizer = vnode.context.$refs[handleRef];
		let resizeWidth = _.get(binding, 'value.width', true) !== false;
		let resizeHeight = _.get(binding, 'value.height', true) !== false;
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

