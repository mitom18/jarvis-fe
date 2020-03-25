import Vue from 'vue'
import router from './router'
import store from './store'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import {TokenService} from './services/storage.service'
import ApiService from './services/api.service'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import App from "./App";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_ROOT_API);

// If token exists set header
if (TokenService.getToken()) {
    ApiService.setHeader();
    ApiService.mount401Interceptor();
}

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
