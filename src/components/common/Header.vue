<template>
  <div class="common-header">
    <div class="common-header-left">
      <img class="common-header-left-image" src="../../assets/logo.png"/>
    </div>
    <div class="common-header-right">
      <div class="common-header-right-operation">
        <div v-if="publicParameters.headType==0">
          <span @click="openChildWindow">登陆</span> | <span @click="registerAccount">注册</span>
        </div>
        <div class="common-header-right-operation-head" v-else>
          <img :src="publicParameters.head" width="30" class="user-head">
          <div class="operating-menu">
            <div class="operating-menu-content">
              <div class="operating-menu-item" @mouseover="moveShow('userInfo')"
                   @mouseout="moutShow('userInfo')">
                <img class="operating-menu-item-logo" src="../../assets/user_infor.png" v-if="userInfo==1"/>
                <img class="operating-menu-item-logo" src="../../assets/user_infor2.png" v-else/>
                <label>{{ publicParameters.username }}</label>
              </div>
              <div class="operating-menu-item" @click="logout" @mouseover="moveShow('quit')"
                   @mouseout="moutShow('quit')">
                <img class="operating-menu-item-logo" src="../../assets/quit.png" v-if="quit==1"/>
                <img class="operating-menu-item-logo" src="../../assets/quit2.png" v-else/>
                <label>退出</label>
              </div>
            </div>
            <!--<s><i></i></s>-->
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible.sync="publicParameters.loginModel" :modal="true" class="login-dialog"
               :close-on-click-modal="false">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-form">
        <div class="close-button-vessel">
          <img src="../../assets/close.png" width="10" class="close-button" @click="publicParameters.loginModel=false">
        </div>
        <el-form-item label="" prop="username" class="login-item login-item1">
          <div class="login-inputImg">
            <img src="../../assets/account.png" height="20" width="20"/>
          </div>
          <div class="login-input">
            <el-input placeholder="请输入用户名" v-model="loginForm.username"></el-input>
          </div>
        </el-form-item>
        <input style="display:none"/>
        <el-form-item label="" prop="password" class="login-item login-item2">
          <div class="login-inputImg">
            <img src="../../assets/password.png" height="20" width="20"/>
          </div>
          <div class="login-input">
            <el-input placeholder="请输入密码" v-model="loginForm.password"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="" prop="remark" class="login-submit">
          <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
        </el-form-item>
      </el-form>
      <div class="fast-login">
        <div class="fast-login-left"></div>
        <span>快速登陆</span>
        <div class="fast-login-right"></div>
        <div class="fast-login-img">
          <a :href="qqCodeUrl">
            <img src="../../assets/qq.png" width="28px" class="fast-login-imgQQ">
          </a>
          <a :href="weChatCodeUrl">
            <img src="../../assets/weChat.png" width="28px" class="fast-login-imgWeChat">
          </a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    created () {
      var accessToken = localStorage.getItem('accessToken')
      if (accessToken === null || typeof (accessToken) === 'undefined') {
        this.publicParameters.headType = 0
      } else {
        this.publicParameters.headType = 1
        this.publicParameters.head = localStorage.getItem('head')
        this.publicParameters.username = localStorage.getItem('username')
      }
    },
    computed: {
      ...mapGetters([
        'publicParameters',
        'schoolFeeData',
        'recordData'
      ])
    },
    data () {
      return {
        userInfo: 1,
        quit: 1,
        qqCodeUrl: 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101413897&redirect_uri=' + window.location.origin + '&state=qqLogin',
        weChatCodeUrl: 'https://open.weixin.qq.com/connect/qrconnect?appid=wxe8d941078f9472af&redirect_uri=' + window.location.origin + '&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect',
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'handleClick',
        'initSchoolFeeListData'
      ]),
      getQueryString (name) {
        // 获取当前URL
        var localUrl = document.location.href
        // 获取要取得的get参数位置
        var get = localUrl.indexOf(name + '=')
        if (get === -1) {
          return null
        }
        // 截取字符串
        var getPar = localUrl.slice(name.length + get + 1)
        // 判断截取后的字符串是否还有其他get参数
        var nextPar = getPar.indexOf('&')
        if (nextPar !== -1) {
          getPar = getPar.slice(0, nextPar)
        }
        return getPar
      },
      // 移入menu
      moveShow (key) {
        if (key === 'userInfo') {
          this.userInfo = 2
        } else if (key === 'quit') {
          this.quit = 2
        }
      },
      // 移出menu
      moutShow (key) {
        if (key === 'userInfo') {
          this.userInfo = 1
        } else if (key === 'quit') {
          this.quit = 1
        }
      },
      openChildWindow () {
        document.getElementById('loginFrame').style.display = 'table'
        var current = this
        var timing = window.setInterval(function () {
          if (localStorage.getItem('accessToken') !== null || document.getElementById('loginFrame').style.display === 'none') {
            clearInterval(timing)
          }
          current.authorizeLogin(timing)
        }, 3000)
      },
      authorizeLogin (timing) {
        var current = this
        axios({
          method: 'POST',
          url: current.publicParameters.loginDomain + '/userPosition/authorize',
          params: {
            redirectUri: window.location.origin
          }
        }).then(function (response) {
          console.log(response.data)
          if (response.data.code === '200') {
            localStorage.setItem('head', response.data.data.head)
            localStorage.setItem('username', response.data.data.username)
            localStorage.setItem('accessToken', response.data.data.accessToken)
            current.publicParameters.head = response.data.data.head
            current.publicParameters.username = response.data.data.username
            current.publicParameters.headType = 1
            clearInterval(timing)
            document.getElementById('loginFrame').style.display = 'none'
          } else if (response.data.code === '700') {
            console.log('等待登陆')
          } else {
            current.promptInfo('error', response.data.message)
            clearInterval(timing)
            document.getElementById('loginFrame').style.display = 'none'
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      logout () {
        this.$confirm('确认退出吗?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          var current = this
          axios({
            method: 'POST',
            url: this.publicParameters.loginDomain + '/user/logout',
            params: {
              access_token: localStorage.getItem('accessTicket')
            }
          }).then(function (response) {
            console.log(response.data)
            if (response.data.code === '200') {
              localStorage.clear()
              current.publicParameters.headType = 0
              current.schoolFeeData.list = []
              current.recordData.list = []
            }
          }).catch(function (error) {
            console.log(error)
          })
        }).catch(() => {
          console.log('取消操作！')
        })
      },
      registerAccount () {
        window.open('http://admin.window.360baige.com/#/admin/register')
      },
      promptInfo (type, info) { // type success成功   warning警告   error失败
        this.$message({message: info, type: type})
        return false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .common-header {
    text-align: left;
    height: 78px;
    .common-header-left, .common-header-right {
      height: 78px;
      line-height: 78px;
    }
    .common-header-right-operation {
      color: #fff;
      span {
        cursor: pointer;
      }
    }
    .common-header-right-operation-head {
      width: 76px;
      height: 78px;
      .user-head {
        margin-top: 24px;
        border-radius: 15px;
      }
    }
    .common-header-right-operation-head:hover {
      .operating-menu {
        display: block;
      }
    }
    .operating-menu {
      position: absolute;
      top: 78px;
      right: 192px;
      font-size: 14pt;
      min-height: 170px;
      min-width: 132px;
      text-align: left;
      display: none;
      .operating-menu-content {
        padding: 5px 0px 5px 0px;
        border: 1px solid #e9e9e9;
        border-radius: 5px;
        position: absolute;
        background-color: #ffffff;
        .operating-menu-item {
          cursor: pointer;
          font-size: 14px;
          color: #505050;
          width: 132px;
          height: 38px;
          line-height: 38px;
          padding-left: 18px;
          .operating-menu-item-logo {
            height: 16px;
            width: 16px;
            position: relative;
            top: 4px;
            margin-right: 12px;
          }
        }
        .operating-menu-item:hover {
          color: #ffffff;
          background-color: #31a7ff;
        }
      }
      /* s {
         position: absolute;
         top: -20px;
         right: 8px;
         border-color: transparent transparent #e9e9e9 transparent;
         border-style: dashed dashed solid dashed;
         border-width: 10px;
       }

       i {
         position: absolute;
         top: -9px;
         left: -10px;
         border-color: transparent transparent #ffffff transparent;
         border-style: dashed dashed solid dashed;
         border-width: 10px;
       }*/
    }
    .common-header-left {
      float: left;
      .common-header-left-image {
        padding-left: 192px;
        height: 38px;
        vertical-align: middle;
      }
    }
    .common-header-right {
      text-align: center;
      float: right;
      margin-right: 192px;
    }
    .login-dialog {
      .login-form {
        /*height: 106px;*/
        width: 390px;
        margin-bottom: 25px;
        .login-item {
          height: 38px !important;
          width: 320px;
          border: 1px solid #e6e6e6;
          line-height: 38px;
          border-radius: 4px;
          background-color: #ffffff;
          .login-inputImg {
            height: 20px;
            display: inline-block;
            margin: 8px 0px 8px 15px;
            float: left;
          }
          .login-input {
            width: 270px;
            height: 38px;
            float: right;
          }
        }
        .login-item1 {
          margin: 8px 36px 19px 36px !important;
        }
        .login-item2 {
          margin: 0px 36px 19px 36px !important;
        }
        .login-submit {
          button {
            width: 100%;
            font-size: 14px;
          }
          margin: 0px 36px 22px 36px !important;
          padding: 0px;
        }
        .close-button-vessel {
          text-align: right;
          .close-button {
            margin: 15px 15px 0px 0px;
            cursor: pointer;
          }
        }
      }
      .fast-login {
        color: #FCA6A6;
        text-align: center;
        margin-bottom: 16px;
        .fast-login-left {
          float: left;
          border-top: 1px solid #cadced;
          width: 122px;
          margin: 10px 9px 0px 36px;
        }
        .fast-login-right {
          border-top: 1px solid #cadced;
          width: 122px;
          float: right;
          margin: 10px 36px 0px 9px;
        }
        .fast-login-img {
          margin-top: 16px;
          .fast-login-imgQQ {
            margin-right: 28px;
          }
          .fast-login-imgWeChat {
            margin-left: 28px;
          }
        }
      }
    }
  }
</style>

