import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
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
