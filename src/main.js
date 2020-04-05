import Vue from 'vue'
import router from './router'
import store from './store'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import VueNotification from "vue-notification"
import {TokenService} from './services/storage.service'
import ApiService from './services/api.service'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import App from "./App"
import NotificationService from "./services/notification.service"

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Vuelidate);
Vue.use(VueNotification);
Vue.config.productionTip = false;

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_ROOT_API);

// Set methods for notifications
NotificationService.init();

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
