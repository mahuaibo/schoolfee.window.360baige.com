import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  publicParameters: {
    path: 'http://192.168.0.101:30000/cloud/window/schoolFee/v1'
  },
  schoolFeeData: {
    list: []
  },
  recordData: {
    list: [],
    classList: []
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
