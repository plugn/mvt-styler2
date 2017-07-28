const ace = require('brace');
let aceStore = {};
module.exports = {
	template: '<div :style="{height: height, width: width}"></div>',

	props: {
		session: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			required: true
		},
		lang: {
			type: String,
			default: 'javascript'
		},
		theme: {
			type: String,
			default: 'chrome'
		},
		height: {
			type: String,
			default: '300px'
		},
		width: {
			type: String,
			default: '100%'
		},
		sync: {
			type: Boolean,
			default: false
		}
	},

	data: function () {
		return {
			editor: null,
		};
	},

	mounted: function () {
		const vm = this;
		var session = vm.session;
		var lang = vm.lang;
		var theme = vm.theme;
		var editor = vm.editor = ace.edit(vm.$el);
		aceStore.editor = editor;
		editor.$blockScrolling = Infinity;
		console.log(' * editor.getSession() : ', editor.getSession());


		editor.getSession(session).setMode('ace/mode/' + lang);
		editor.setTheme('ace/theme/' + theme);
		editor.setValue(vm.content, 1);
		editor.on('change', function () {
			vm.$parent.$emit('editor-update', editor.getValue());
		});
	},
	methods: {
		getEditor() {
			return aceStore.editor;
		}
	},

	watch: {
		session: function (value) {
			const vm = this;
			if (vm.session) {
				console.log(' * vm.session : ', vm.session);
				
				
				vm.editor.getSession(value).setMode('ace/mode/' + vm.lang);
			}
		},
		content: function (newContent) {
			const vm = this;
			if (vm.sync) {
				vm.editor.setValue(newContent, 1);
			}
		},

		theme: function (newTheme) {
			const vm = this;
			vm.editor.setTheme('ace/theme/' + newTheme);
		}
	}
};
