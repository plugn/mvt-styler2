import _ from 'lodash';

export default {

	inserted (element, binding, vnode) {
		// console.log('inserted', element, 'binding', binding);
		let handleRef = element.dataset.handle;
		if (!handleRef) {
			throw new Error('(!) handleRef: ', handleRef);
		}

		let resizer = vnode.context.$refs[handleRef];
		let resizeWidth = _.get(binding, 'value.width', true) !== false;
		let resizeHeight = _.get(binding, 'value.height', true) !== false;

		resizer.addEventListener('mousedown', initResize, false);

		function initResize(e) {
			window.addEventListener('mousemove', resize, false);
			window.addEventListener('mouseup', stopResize, false);
		}

		function resize(e) {
			let {offsetLeft, offsetTop} = element;
			// console.log('e.client', e.clientX+','+e.clientY, '; left, top:', offsetLeft+', '+offsetTop);

			if (resizeWidth) {
				element.style.width = (e.clientX - offsetLeft) + 'px';
			}
			if (resizeHeight) {
				element.style.height = (e.clientY - offsetTop) + 'px';
			}

			if (vnode.context && 'function' === typeof vnode.context.onAfterResize) {
				vnode.context.onAfterResize();
			}
		}

		function stopResize(e) {
			window.removeEventListener('mousemove', resize, false);
			window.removeEventListener('mouseup', stopResize, false);
		}
	}

}

