import Sortable from 'sortablejs'

let sortable;

export default  {
	inserted: function (el, binding) {
		sortable = new Sortable(el, binding && binding.value || {});
	}
}