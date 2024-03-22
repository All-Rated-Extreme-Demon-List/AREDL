import './assets/main.css'

import {computed, createApp, reactive, ref} from 'vue'
import App from './App.vue'
import router from './router'
import Multiselect from 'vue-multiselect'
import {ColorPicker} from "vue-accessible-color-picker";

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
createApp(App).use(router).component('multiselect', Multiselect).mount('#app')