// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as uiv from 'uiv'
import BootstrapVue from 'bootstrap-vue'
import { createStore } from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css'

const store = createStore()

Vue.config.productionTip = false
Vue.use(uiv)
Vue.use(BootstrapVue)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeMount: function () {
    this.userId = this.$el.attributes['data-user-id'].value
  }
})
