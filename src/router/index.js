import Vue from 'vue'
import VueRouter from "vue-router"
import takePic from "../components/takePic.vue"

Vue.use(VueRouter);
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
const routes = [{
	name: "takePic",
	path: '/takePic',
	component:takePic
} ]
const router = new VueRouter({
	mode: 'hash',
	routes // routes: routes 的简写
})
export default router