<template>
  <div class="index">
    <div class="content-head">
      <el-button type="primary" style="width: 86px;height: 36px;" @click="addSchoolFee">新增</el-button>
    </div>
    <div class="comtent-list" style="text-align: center;">
      <el-table :data="schoolFeeData.list" max-height="510">
        <el-table-column label="创建时间" width="180">
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
                     :current-page.sync="schoolFeeData.pageData.current" :page-sizes="[50, 100, 200]"
                     :page-size="schoolFeeData.pageData.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="schoolFeeData.pageData.total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="schoolFeeModal" :close-on-click-modal="false">
      <div class="close-button-vessel">
        <span>{{ dialogTitle }}</span>
        <img src="../../assets/white-close.png" width="10" class="close-button" @click="schoolFeeModal=false">
      </div>
      <el-form :model="schoolFeeForm" ref="schoolFeeForm" :rules="schoolFeeRule" label-width="100px"
               class="school-fee-form">
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
        <el-form-item label="限制缴费:" prop="isLimit">
          <el-select v-model="schoolFeeForm.isLimit" placeholder="请选择..." style="width: 100%">
            <el-option label="否" value="1"></el-option>
            <el-option label="是" value="0"></el-option>
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
      var accessToken = localStorage.getItem('accessToken')
      if (accessToken !== null && typeof (accessToken) !== 'undefined') {
        this.initSchoolFeeListData(this.schoolFeeData.pageData)
      }
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
        dialogTitle: '',
        schoolFeeForm: {
          url: null,
          id: null,
          name: null,
          desc: null,
          link: null,
          isLimit: '1',
          status: '0'
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
        this.initSchoolFeeListData(this.pageData)
      },
      filterTag (value, row) {
        return row.tag === value
      },
      // 新增收费项目
      addSchoolFee () {
        this.schoolFeeForm = {}
        this.schoolFeeForm.isLimit = '1'
        this.schoolFeeForm.status = '0'
        this.dialogTitle = '新增'
        this.schoolFeeForm.url = this.publicParameters.path + '/project/add'
        this.schoolFeeModal = true
      },
      // 修改收费项目
      schoolFeeModify (index) {
        this.dialogTitle = '修改'
        this.schoolFeeForm.url = this.publicParameters.path + '/project/modify'
        this.schoolFeeForm = index
        this.schoolFeeForm.isLimit = index.isLimit + ''
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
            isLimit: this.schoolFeeForm.isLimit,
            desc: this.schoolFeeForm.desc,
            link: this.schoolFeeForm.link,
            status: this.schoolFeeForm.status
          }
        }).then(function (response) {
          console.log(response.data)
          if (response.data.code === '200') {
            current.initSchoolFeeListData(current.pageData)
            current.schoolFeeModal = false
            current.messageRemind('success', response.data.message)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      messageRemind (type, info) { // type success成功   warning警告   error失败
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

  .school-fee-form {
    padding: 0px;
    margin-right: 20px;
  }

  .close-button-vessel {
    background: #4db3ff;
    padding: 15px;
    margin-bottom: 22px;
    text-align: right;
    span {
      float: left;
      color: #ffffff;
      font-size: 16px;
    }
    .close-button {
      cursor: pointer;
    }
  }
</style>
