import axios from 'axios'

// ///////////////////////缴费系统.项目列表数据//////////////////////////////
export const initSchoolFeeListData = (state, index, row) => {
  state.schoolFeeData.list = []
  axios({
    method: 'GET',
    url: 'http://localhost:30000/win/schoolfee/v1/project/list',
    params: {
      access_token: localStorage.getItem('positionAccessToken'),
      page_size: index.pageSize,
      current: index.current
    }
  }).then(function (response) {
    console.log(response.data)
    if (response.data.code === '200') {
      state.schoolFeeData.list = response.data.data.List
    }
  }).catch(function (error) {
    console.log(error)
  })
}

// ///////////////////////缴费系统.缴费人员数据//////////////////////////////
export const initRecordListData = (state, index, row) => {
  state.recordData.list = []
  axios({
    method: 'GET',
    url: 'http://localhost:30000/win/schoolfee/v1/record/list',
    params: {
      access_token: localStorage.getItem('positionAccessToken'),
      project_id: index.projectId,
      page_size: index.pageSize,
      current: index.current
    }
  }).then(function (response) {
    console.log(response.data)
    if (response.data.code === '200') {
      state.recordData.list = response.data.data.List
    }
  }).catch(function (error) {
    console.log(error)
  })
}

// ///////////////////////缴费系统.缴费人员数据//////////////////////////////
export const initClassListData = (state, index, row) => {
  state.recordData.classList = []
  axios({
    method: 'GET',
    url: 'http://localhost:30000/win/schoolfee/v1/record/classList',
    params: {
      access_token: localStorage.getItem('positionAccessToken'),
      project_id: index.projectId
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
