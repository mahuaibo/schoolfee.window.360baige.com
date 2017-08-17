<template>
  <div class="index">
    <div class="content-head">
      <div class="content-head-left">
        <i class="el-icon-arrow-left" @click="returnRecordList">返回</i>
        <u style="text-decoration: none;">{{ projectName }}</u>
      </div>
      <div class="content-head-right">
        <el-upload class="upload-demo" name="uploadFile" accept=".xlsx"
                   :action="uploadUrl" :show-file-list="false" :on-success="uploadSuccess">
          <el-button slot="trigger" type="text">上传名单</el-button>
          <el-button style="margin-left: 10px;" type="text" @click="downloadList">下载名单</el-button>
          <el-button style="margin-left: 10px;color: red;" type="text" @click="deleteRecord">删除</el-button>
        </el-upload>
      </div>
    </div>
    <div class="comtent-list">
      <el-table :data="recordData.list" border @selection-change="setIds">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column label="创建时间" width="120">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="100">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级" width="100">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.class_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号码" width="160">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id_card }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号" width="120">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" width="140">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应缴费用" width="100">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否缴费" width="100">
          <template scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.is_fee==0">未交费</span>
            <span style="margin-left: 10px" v-else>已缴费</span>
          </template>
        </el-table-column>
        <el-table-column label="缴费时间" width="120">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.fee_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="comtent-paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="recordListData.current" :page-sizes="[50, 100, 200]"
                       :page-size="recordListData.pageSize" layout="sizes, prev, pager, next"
                       :total="recordListData.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="下载筛选" :visible.sync="recordModal" @click="this.recordModal = false">
      <el-form :model="recordForm" ref="recordForm" label-width="100px">
        <el-form-item label="班级:" prop="limit">
          <el-select v-model="recordForm.classNames" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="item in recordData.classList" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费项:" prop="limit">
          <el-select v-model="recordForm.isLimit" placeholder="请选择..." style="width: 100%" multiple>
            <el-option label="已缴费" value="0"></el-option>
            <el-option label="未交费" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;float: right;" @click="downloadSubmit">下载</el-button>
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
      this.initRecordListData(this.recordListData)
    },
    computed: {
      ...mapGetters([
        'recordData'
      ])
    },
    data () {
      return {
        projectName: this.$route.query.n + ':名单',
        ids: [],
        uploadUrl: 'http://localhost:30000/win/schoolfee/v1/record/upload?a=' + localStorage.getItem('positionAccessToken') + '&i=' + this.$route.query.i,
        recordListData: {
          projectId: this.$route.query.i,
          pageSize: 50,
          current: 1,
          total: 1
        },
        options: [{
          value: '一年级'
        }, {
          value: '二年级'
        }, {
          value: '三年级'
        }],
        recordModal: false,
        recordForm: {
          classNames: [],
          isLimit: []
        }
      }
    },
    methods: {
      ...mapActions([
        'initRecordListData',
        'initClassListData'
      ]),
      // 选择框发生改变
      setIds (val) {
        this.ids = val
      },
      returnRecordList () {
        router.push('/schoolfee/list')
      },
      // 上传名单
      uploadSuccess (index) {
        console.log(index)
        if (index.code !== '200') {
          this.messageRemind('error', index.message)
        }
        this.messageRemind('success', index.message)
        this.initRecordListData(this.recordListData)
      },
      // 下载名单
      downloadList () {
        this.initClassListData(this.recordListData)
        console.log('下载名单')
        this.recordModal = true
      },
      downloadSubmit () {
        if (this.recordForm.classNames.length === 0) {
          this.messageRemind('warning', '请选择班级！')
        }
        if (this.recordForm.isLimit.length === 0) {
          this.messageRemind('warning', '请选择缴费项！')
        }
        window.open('http://localhost:30000/win/schoolfee/v1/record/download?access_token=' + localStorage.getItem('positionAccessToken') + '&class_names=' + this.recordForm.classNames.join(',') + '&is_fees=' + this.recordForm.isLimit.join(','))
        this.recordModal = false
        this.recordForm.classNames = []
        this.recordForm.isLimit = []
      },
      handleSizeChange (val) {
        this.initRecordListData(this.recordListData)
      },
      handleCurrentChange (val) {
        this.initRecordListData(this.recordListData)
      },
      // 删除
      deleteRecord () {
        var current = this
        var ids = this.getTheSelectedIds()
        if (ids) {
          this.$confirm('确认删除此应用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios({
              method: 'POST',
              url: 'http://localhost:30000/win/schoolfee/v1/record/delete',
              params: {
                access_token: localStorage.getItem('positionAccessToken'),
                record_ids: ids.join(',')
              }
            }).then(function (response) {
              if (response.data.code === '200') {
                current.initRecordListData(current.recordListData)
                current.messageRemind('success', response.data.message)
              }
            }).catch(function (error) {
              console.log(error)
            })
          }).catch(() => {
            console.log('点击了取消按钮！')
          })
        }
      },
      // 获取被勾选数据Ids
      getTheSelectedIds () {
        var ids = []
        var data = this.ids
        if (!data.length) {
          this.$message({type: 'info', message: '请选择数据！'})
          return
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i]['is_fee'] !== 0) {
            this.$message({type: 'info', message: '已缴费数据不得删除！'})
            return
          }
          ids.push(data[i]['id'])
        }
        return ids
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
    margin: 10px;
    font-size: 14px;
    .content-head-left {
      float: left;
    }
    .content-head-right {
      float: right;
      margin-right: 15px;
    }
  }

  .comtent-paging {
    padding-top: 20px;
    position: absolute;
    right: 20px;
  }

  .el-icon-arrow-left {
    margin-right: 20px;
    color: #4db3ff;
    cursor: pointer;
  }
</style>
