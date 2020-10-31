import Vue from 'vue'
import Vuex from 'vuex'

import apiService from '@/helpers/apiService'

import mutations from './mutations'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    apiService() {
      return apiService
    }
  },
  mutations,
  modules
})
