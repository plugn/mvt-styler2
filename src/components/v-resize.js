export  default {
	inserted (element, binding, vnode) {
		let refs = vnode.context.$refs;
		console.log('inserted', element, 'binding', binding, refs.resizer);

		let resizer = vnode.context.$refs.resizer;
		resizer.addEventListener('mousedown', initResize, false);

		function initResize(e) {
			window.addEventListener('mousemove', resize, false);
			window.addEventListener('mouseup', stopResize, false);
		}
// TODO: 'h':false, 'w':false bindings
		function resize(e) {
			element.style.width = (e.clientX - element.offsetLeft) + 'px';
			// element.style.height = (e.clientY - element.offsetTop) + 'px';
		}

		function stopResize(e) {
			window.removeEventListener('mousemove', resize, false);
			window.removeEventListener('mouseup', stopResize, false);
		}
	}

}

