export  default {



	inserted (element, binding, vnode) {
		console.log('inserted', element, 'binding', binding, 'vnode', vnode);

		var resizer = document.querySelector('.el-resizer');
		resizer.addEventListener('mousedown', initResize, false);

		function initResize(e) {
			window.addEventListener('mousemove', resize, false);
			window.addEventListener('mouseup', stopResize, false);
		}

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

