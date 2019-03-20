import Calendar from '@/components/Calendar.vue'

export default {
	install(Vue, options) {
		if (typeof window !== 'undefined' && window.Vue) {
			Vue = window.Vue
		}
		Vue.component('Tour-Calendar', Calendar)
	}
}
