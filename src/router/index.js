import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import SchoolfeeList from '@/components/schoolfee/List'
import RecordList from '@/components/record/List'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/schoolfee/list'
  }, {
    name: 'home',
    component: Home,
    path: '/home',
    alias: '',
    children: [{
      name: 'schoolfee/list',
      component: SchoolfeeList,
      path: '/schoolfee/list',
      alias: 'schoolfee/list'
    }, {
      name: 'record/list',
      component: RecordList,
      path: '/record/list',
      alias: 'record/list'
    }]
  }
  ]
})
