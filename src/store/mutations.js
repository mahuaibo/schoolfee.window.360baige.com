import axios from 'axios'

// ///////////////////////缴费系统.项目列表数据//////////////////////////////
export const initSchoolFeeListData = (state, index, row) => {
  state.schoolFeeData.list = []
  axios({
    method: 'POST',
    url: state.publicParameters.path + '/project/list',
    params: {
      accessToken: localStorage.getItem('accessToken'),
      pageSize: index.pageSize,
      current: index.current
    }
  }).then(function (response) {
    console.log(response.data)
    if (response.data.code === '200') {
      state.schoolFeeData.list = response.data.data.list
      index.pageSize = response.data.data.pageSize
      index.current = response.data.data.current
      index.total = response.data.data.total
    }
  }).catch(function (error) {
    console.log(error)
  })
}

// ///////////////////////缴费系统.缴费人员数据//////////////////////////////
export const initRecordListData = (state, index, row) => {
  state.recordData.list = []
  axios({
    method: 'POST',
    url: state.publicParameters.path + '/record/list',
    params: {
      accessToken: localStorage.getItem('accessToken'),
      projectId: index.projectId,
      pageSize: index.pageSize,
      current: index.current
    }
  }).then(function (response) {
    console.log(response.data)
    if (response.data.code === '200') {
      state.recordData.list = response.data.data.list
      index.pageSize = response.data.data.pageSize
      index.current = response.data.data.current
      index.total = response.data.data.total
    }
  }).catch(function (error) {
    console.log(error)
  })
}

// ///////////////////////缴费系统.缴费人员数据//////////////////////////////
export const initClassListData = (state, index, row) => {
  state.recordData.classList = []
  axios({
    method: 'POST',
    url: state.publicParameters.path + '/record/classList',
    params: {
      accessToken: localStorage.getItem('accessToken'),
      projectId: index.projectId
    }
  }).then(function (response) {
    console.log(response.data)
    if (response.data.code === '200') {
      state.recordData.classList = response.data.data
    }
  }).catch(function (error) {
    console.log(error)
  })
}
