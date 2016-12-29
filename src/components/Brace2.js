import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const editor = ace.edit('javascript-editor');
editor.getSession().setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');