import './assets/main.css'

import {computed, createApp, reactive, ref} from 'vue'
import App from './App.vue'
import router from './router'
import Multiselect from 'vue-multiselect'

export const store = reactive({
    permissions: ref({}),
    user: ref({}),
    hasPermission(action) {
        return computed(() => {
            if (this.permissions == null) return false
            return action in this.permissions
        })
    }
});
createApp(App).use(router).component('multiselect', Multiselect).mount('#app')