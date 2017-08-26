<style lang="scss">
  .el-dialog {
    width: 456px;
    .el-dialog__body {
      padding: 6px 8px 6px 0px;
    }
    .el-form-item {
      margin: 14px 14px 20px 14px;
    }
  }

  .el-dialog__header {
    background-color: #31a7ff;
    padding: 0px;
    margin: 0px;
    height: 55px;
    line-height: 60px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    text-align: left;
    padding-left: 20px;
    .el-dialog__title {
      color: #ffffff;
      font-size: 18px;
      font-weight: normal;
    }
    .el-dialog__headerbtn {
      padding-top: 20px;
      padding-right: 20px;
      .el-icon-close {
        color: #ffffff;
      }
    }
  }

  .el-table th {
    text-align: center;
  }
</style>
<template>
  <div class="index">
    <div class="content-head">
      <el-button type="primary" style="width: 86px;height: 36px;" @click="addSchoolFee">新增</el-button>
    </div>
    <div class="comtent-list" style="text-align: center;">
      <el-table :data="schoolFeeData.list" max-height="510">
        <el-table-column label="创建时间" width="160">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" width="140">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="限制缴费" width="160">
          <template scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.isLimit==0">是</span>
            <span style="margin-left: 10px" v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.status==0">启用</span>
            <span style="margin-left: 10px" v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="200">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" size="small" @click="schoolFeeModify(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="getRecordList(scope.row)">名单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="comtent-paging">
      <el-pagination @size-change="pagingUpdatesData" @current-change="pagingUpdatesData"
                     :current-page.sync="schoolFeeListData.current" :page-sizes="[50, 100, 200]"
                     :page-size="schoolFeeListData.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="schoolFeeListData.total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="schoolFeeModal" @click="this.schoolFeeModal = false">
      <el-form :model="schoolFeeForm" :rules="schoolFeeRule" ref="schoolFeeForm" label-width="100px"
               style="padding:0px 10px 0px 0px;">
        <el-form-item label="项目名称:" prop="name">
          <el-input type="text" placeholder="请输入项目名称..." v-model="schoolFeeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述:" prop="desc">
          <el-input type="textarea" :rows="3" placeholder="请输入项目描述..." v-model="schoolFeeForm.desc"
                    resize="none"></el-input>
        </el-form-item>
        <el-form-item label="描述连接:" prop="link">
          <el-input type="text" v-model="schoolFeeForm.link" placeholder="请输入描述连接..."></el-input>
        </el-form-item>
        <el-form-item label="限制缴费:" prop="limit">
          <el-select v-model="schoolFeeForm.limit" placeholder="请选择..." style="width: 100%">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目状态:" prop="status">
          <el-select v-model="schoolFeeForm.status" placeholder="请选择..." style="width: 100%">
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="submit-button" @click="schoolFeeSubmit('schoolFeeForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import router from '../.././router'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    created () {
      this.initSchoolFeeListData(this.schoolFeeListData)
    },
    computed: {
      ...mapGetters([
        'schoolFeeData',
        'publicParameters'
      ])
    },
    data () {
      return {
        schoolFeeModal: false,
        dialogTitle: '标题',
        schoolFeeForm: {
          url: null,
          id: null,
          name: null,
          desc: null,
          link: null,
          limit: '1',
          status: '0'
        },
        schoolFeeListData: {
          pageSize: 50,
          current: 1,
          total: 1
        },
        schoolFeeRule: {
          name: [
            {required: true, message: '请填写名称!', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'initSchoolFeeListData'
      ]),
      pagingUpdatesData (val) {
        this.initSchoolFeeListData(this.schoolFeeListData)
      },
      filterTag (value, row) {
        return row.tag === value
      },
      // 新增收费项目
      addSchoolFee () {
        this.dialogTitle = '新增'
        this.schoolFeeForm.url = this.publicParameters.path + '/project/add'
        this.schoolFeeModal = true
      },
      // 修改收费项目
      schoolFeeModify (index) {
        this.dialogTitle = '修改'
        this.schoolFeeForm.url = this.publicParameters.path + '/project/modify'
        this.schoolFeeForm.id = index.id
        this.schoolFeeForm.name = index.name
        this.schoolFeeForm.limit = index.isLimit + ''
        this.schoolFeeForm.desc = index.desc
        this.schoolFeeForm.link = index.link
        this.schoolFeeForm.status = index.status + ''
        this.schoolFeeModal = true
      },
      // 名单跳转
      getRecordList (index) {
        console.log(index)
        router.push('/record/list?i=' + index.id + '&n=' + index.name + '&is=' + index.isLimit)
      },
      // 表单提交
      schoolFeeSubmit () {
        var current = this
        axios({
          method: 'POST',
          url: this.schoolFeeForm.url,
          params: {
            accessToken: localStorage.getItem('accessToken'),
            id: this.schoolFeeForm.id,
            name: this.schoolFeeForm.name,
            isLimit: this.schoolFeeForm.limit,
            desc: this.schoolFeeForm.desc,
            link: this.schoolFeeForm.link,
            status: this.schoolFeeForm.status
          }
        }).then(function (response) {
          console.log(response.data)
          if (response.data.code === '200') {
            current.initSchoolFeeListData(current.schoolFeeListData)
            current.schoolFeeModal = false
            current.schoolFeeForm = []
            current.messageRemind('success', response.data.message)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      messageRemind  (type, info) { // type success成功   warning警告   error失败
        this.$message({message: info, type: type})
        return false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .index {
    margin: 0px 192px 0px 192px;
  }

  .content-head {
    text-align: left;
    height: 36px;
    margin-top: 32px;
    margin-bottom: 30px;
  }

  /*.comtent-list {*/
  /*max-height: calc(100vh - 230px);*/
  /*overflow: scroll;*/
  /*}*/

  .comtent-paging {
    float: right;
    padding-top: 30px;
  }

  .submit-button {
    width: 100%;
    float: right;
    background-color: #31a7ff;
    color: #ffffff;
    border: 0px solid #ffffff
  }
</style>
