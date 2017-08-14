<template>
  <div class="index">
    <div class="content-head">
      <el-button type="text" @click="addSchoolFee">新增</el-button>
    </div>
    <div class="comtent-list">
      <el-table :data="schoolFeeData.list" border>
        <el-table-column label="创建时间" width="160">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" width="140">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.status==0">启用</span>
            <span style="margin-left: 10px" v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="180">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="限制缴费" width="160">
          <template scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.is_limit==0">是</span>
            <span style="margin-left: 10px" v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" size="small" @click="schoolFeeModify(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="getRecordList(scope.row)">名单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="comtent-paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="schoolFeeListData.current" :page-sizes="[50, 100, 200]"
                       :page-size="schoolFeeListData.pageSize" layout="sizes, prev, pager, next"
                       :total="schoolFeeListData.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="schoolFeeModal" @click="this.schoolFeeModal = false">
      <el-form :model="schoolFeeForm" :rules="schoolFeeRule" ref="schoolFeeForm" label-width="100px">
        <el-form-item label="项目名称:" prop="name">
          <el-input type="text" v-model="schoolFeeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述:" prop="desc">
          <el-input type="text" v-model="schoolFeeForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="描述连接:" prop="link">
          <el-input type="text" v-model="schoolFeeForm.link" number></el-input>
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
          <el-button style="width:100%;float: right;" @click="schoolFeeSubmit('schoolFeeForm')">提交</el-button>
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
        'schoolFeeData'
      ])
    },
    data () {
      return {
        schoolFeeModal: false,
        modalTitle: '标题',
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
      handleSizeChange (val) {
        this.initSchoolFeeListData(this.schoolFeeListData)
      },
      handleCurrentChange (val) {
        this.initSchoolFeeListData(this.schoolFeeListData)
      },
      filterTag (value, row) {
        return row.tag === value
      },
      // 新增收费项目
      addSchoolFee () {
        this.schoolFeeForm.url = 'http://localhost:30000/win/schoolfee/v1/project/add'
        this.schoolFeeModal = true
      },
      // 修改收费项目
      schoolFeeModify (index) {
        this.schoolFeeForm.url = 'http://localhost:30000/win/schoolfee/v1/project/modify'
        this.schoolFeeForm.id = index.id
        this.schoolFeeForm.name = index.name
        this.schoolFeeForm.limit = index.is_limit + ''
        this.schoolFeeForm.desc = index.desc
        this.schoolFeeForm.link = index.link
        this.schoolFeeForm.status = index.status + ''
        this.schoolFeeModal = true
      },
      // 名单跳转
      getRecordList (index) {
        router.push('/record/list?i=' + index.id + '&n=' + index.name)
      },
      // 表单提交
      schoolFeeSubmit () {
        var current = this
        axios({
          method: 'POST',
          url: this.schoolFeeForm.url,
          params: {
            access_token: localStorage.getItem('positionAccessToken'),
            id: this.schoolFeeForm.id,
            name: this.schoolFeeForm.name,
            is_limit: this.schoolFeeForm.limit,
            desc: this.schoolFeeForm.desc,
            link: this.schoolFeeForm.link,
            status: this.schoolFeeForm.status
          }
        }).then(function (response) {
          console.log(response.data)
          if (response.data.code === '200') {
            current.initSchoolFeeListData(current.schoolFeeListData)
            current.schoolFeeModal = false
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
  .content-head {
    width: 60px;
    margin: 10px;
  }

  .comtent-paging {
    padding-top: 20px;
    position: absolute;
    right: 20px;
  }
</style>
