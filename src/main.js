import Vue from 'vue'
import App from './App'
import store from './store'
import plugin from './js_sdk/uni-admin/plugin'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.config.productionTip = false

Vue.use(contentmenu)

Vue.use(plugin)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
