import './assets/main.css'

import {computed, createApp, reactive, ref} from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from "primevue/config";
import Multiselect from 'primevue/multiselect'
import {ColorPicker} from "vue-accessible-color-picker";
import 'primevue/resources/themes/aura-dark-teal/theme.css'
import FloatLabel from "primevue/floatlabel";
import VueClipboard from "vue-clipboard2";

export const store = reactive({
    permissions: ref({}),
    user: ref({}),
    color: ref(''),
    default_color: ref(''),
    hasPermission(action) {
        return computed(() => {
            if (this.permissions == null) return false
            return action in this.permissions
        })
    },
});
createApp(App)
    .use(router)
    .use(PrimeVue, {})
    .use(VueClipboard)
    .component("Multiselect", Multiselect)
    .component("FloatLabel", FloatLabel)
    .mount('#app')