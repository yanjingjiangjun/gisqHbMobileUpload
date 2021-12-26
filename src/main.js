import Vue from 'vue'
import VueRouter from "vue-router";
import App from './App.vue'
import router from "./router"
import VConsole from 'vconsole'
var vConsole = new VConsole();
Vue.config.productionTip = false

new Vue({
	router: router,
	render: h => h(App),
	
}).$mount('#app')
