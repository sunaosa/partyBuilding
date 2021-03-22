import Vue from 'vue'
import App from './App'
import {myRequest} from './unit/api.js'
import uView from "uview-ui"
import store from 'store/index.js'

Vue.prototype.$myRequest = myRequest
Vue.config.productionTip = false
Vue.prototype.$store = store

Vue.use(uView)
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
