import Sortable from 'sortablejs'

let sortable;

export default function (el, binding) {
	sortable = new Sortable(el, binding && binding.value || {});
}
