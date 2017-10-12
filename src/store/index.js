import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  publicParameters: {
    path: 'http://192.168.0.101:30000/cloud/window/schoolFee/v1',
    loginModel: false,
    headType: 0
  },
  schoolFeeData: {
    list: [],
    pageData: {
      pageSize: 50,
      current: 1,
      total: 1
    }
  },
  recordData: {
    list: [],
    classList: [],
    recordListData: {
      projectId: 0,
      pageSize: 50,
      current: 1,
      total: 1
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
