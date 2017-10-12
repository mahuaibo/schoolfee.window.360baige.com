<template>
  <div class="index">
    <div class="content-head">
      <div class="content-head-left">
        <i class="el-icon-arrow-left" @click="returnRecordList">返回</i>
        <u class="content-head-poriectname">{{ projectName }}</u>
      </div>
      <div class="content-head-right">
        <el-upload class="upload-demo" name="uploadFile" accept=".xlsx" :action="publicParameters.path + uploadUrl"
                   :show-file-list="false" :on-success="uploadSuccess">
          <el-button slot="trigger" type="primary" class="content-head-upload" v-if="this.$route.query.is==0">
            <span>上传名单</span>
          </el-button>
        </el-upload>
        <el-button class="content-head-download" type="primary" @click="downloadList">下载名单</el-button>
        <el-button class="content-head-delete" type="primary" @click="deleteRecord">删除</el-button>
      </div>
    </div>
    <div class="comtent-list">
      <el-table :data="recordData.list" @selection-change="setIds" max-height="510">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="创建时间" width="160">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级" width="140">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="120">
          <template scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>学号: {{ scope.row.num }}</p>
              <p>联系电话: {{ scope.row.phone }}</p>
              <p>身份证号: {{ scope.row.idCard }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag>{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="应缴费用" width="120">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否缴费" width="120">
          <template scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.isFee==0">未缴费</span>
            <span style="margin-left: 10px" v-else>已缴费</span>
          </template>
        </el-table-column>
        <el-table-column label="缴费时间" width="160">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.feeTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="comtent-paging">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="recordListData.current" :page-sizes="[50, 100, 200]"
                     :page-size="recordListData.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="recordListData.total">
      </el-pagination>
    </div>
    <el-dialog title="下载筛选" :visible.sync="recordModal" :close-on-click-modal="false">
      <div class="close-button-vessel">
        <span>下载名单</span>
        <img src="../../assets/white-close.png" width="10" class="close-button" @click="recordModal=false">
      </div>
      <el-form :model="recordForm" ref="recordForm" label-width="100px" class="record-form">
        <el-form-item label="班级:" prop="limit">
          <el-select v-model="recordForm.classNames" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="item in recordData.classList" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否缴费:" prop="limit">
          <el-select v-model="recordForm.isLimit" placeholder="请选择..." style="width: 100%" multiple>
            <el-option label="已缴费" value="1"></el-option>
            <el-option label="未交费" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="download-button" @click="downloadSubmit">下载</el-button>
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
        'recordData',
        'publicParameters'
      ])
    },
    data () {
      return {
        projectName: this.$route.query.n + '：名单',
        ids: [],
        uploadUrl: '/record/upload?accessToken=' + localStorage.getItem('accessToken') + '&projectId=' + this.$route.query.i,
        recordListData: {
          projectId: this.$route.query.i,
          pageSize: 50,
          current: 1,
          total: 1
        },
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
          return
        }
        this.messageRemind('success', index.message)
        this.initRecordListData(this.recordListData)
      },
      // 下载名单
      downloadList () {
        this.initClassListData(this.recordListData)
        this.recordModal = true
      },
      downloadSubmit () {
        if (this.recordForm.classNames.length === 0) {
          this.messageRemind('warning', '请选择班级！')
        }
        if (this.recordForm.isLimit.length === 0) {
          this.messageRemind('warning', '请选择缴费项！')
        }
        window.open(this.publicParameters.path + '/record/download?accessToken=' + localStorage.getItem('accessToken') + '&projectId=' + this.recordListData.projectId + '&classNames=' + this.recordForm.classNames.join(',') + '&isFees=' + this.recordForm.isLimit.join(','))
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
          this.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios({
              method: 'POST',
              url: this.publicParameters.path + '/record/delete',
              params: {
                accessToken: localStorage.getItem('accessToken'),
                recordIds: ids.join(',')
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
          if (data[i]['isFee'] !== 0) {
            this.$message({type: 'info', message: '已缴费数据不得删除！'})
            return
          }
          ids.push(data[i]['id'])
        }
        return ids
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
    margin-top: 32px;
    margin-bottom: 30px;
    height: 36px;
    .content-head-left {
      float: left;
      height: 36px;
      line-height: 36px;
      .content-head-poriectname {
        text-decoration: none;
      }
    }
    .content-head-right {
      float: right;
      .upload-demo {
        display: inline;
        .content-head-upload {
          width: 86px;
          height: 36px;
          margin-right: 20px;
        }
      }
      .content-head-download {
        width: 86px;
        height: 36px;
        margin-right: 8px;
      }
      .content-head-delete {
        width: 86px;
        height: 36px;
      }
    }
  }

  .download-button {
    width: 100%;
    float: right;
    background-color: #31a7ff;
    color: #ffffff;
    border: 0px solid #ffffff;
  }

  .comtent-list {
    text-align: center;
  }

  .comtent-paging {
    float: right;
    padding-top: 30px;
    margin-bottom: 20px;
  }

  .el-icon-arrow-left {
    margin-right: 20px;
    color: #20a0ff;
    cursor: pointer;
  }

  .record-form {
    padding: 0px;
    margin-right: 15px;
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
