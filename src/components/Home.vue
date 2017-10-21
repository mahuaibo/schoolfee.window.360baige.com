<template>
  <div class="layout">
    <div class="layout-sidebar-header">
      <common-header></common-header>
      <!--<img class="header-left-image" src="../assets/logo.png" height="38"/>-->
    </div>
    <div class="layout-container">
      <div id="loginFrame">
        <div class="login-mask"></div>
        <div class="close-button-vessel">
          <img src="../assets/close.png" width="10" class="close-button" @click="closeLoginFrame">
        </div>
        <iframe class="login-frame" src="http://localhost:8081/#/admin/dialogLogin"></iframe>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import CommonHeader from '@/components/common/Header'
  export default {
    mounted () {
      if (typeof (this.$route.query.a) !== 'undefined') {
        localStorage.setItem('accessToken', this.$route.query.a)
      }
      var iTop = (window.screen.height - 120 - 299) / 2 // 获得窗口的垂直位置
      var iLeft = (window.screen.width - 10 - 390) / 2 // 获得窗口的水平位置
      document.getElementsByClassName('login-frame')[0].style.position = 'absolute'
      document.getElementsByClassName('login-frame')[0].style.top = iTop + 'px'
      document.getElementsByClassName('login-frame')[0].style.left = iLeft + 'px'
      document.getElementsByClassName('close-button-vessel')[0].style.position = 'absolute'
      document.getElementsByClassName('close-button-vessel')[0].style.top = iTop + 5 + 'px'
      document.getElementsByClassName('close-button-vessel')[0].style.left = iLeft + 365 + 'px'
    },
    computed: {
      ...mapGetters([])
    },
    components: {CommonHeader},
    data () {
      return {}
    },
    methods: {
      ...mapActions([]),
      closeLoginFrame () {
        document.getElementById('loginFrame').style.display = 'none'
      }
    }
  }

</script>

<style lang="scss">
  .el-dialog {
    top: 25% !important;
    width: 390px !important;
    border-radius: 4px;
    padding: 0px !important;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px !important;
      .el-form-item__content {
        width: 318px;
        .el-input__inner {
          border: 0px;
        }
      }
    }
  }

  .el-dialog .el-dialog__body .el-form-item__content {
    width: auto;
  }

  .el-textarea__inner {
    border: 0px solid #000;
    padding: 3px 10px;
  }

  .el-table th {
    text-align: center;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .layout {
    .layout-sidebar-header {
      background: #002f5c;
      height: 78px;
      width: 100%;
      min-width: 1080px;
      position: absolute;
      left: 0;
      .header-left-image {
        position: absolute;
        left: 192px;
        margin-top: 20px;
        vertical-align: middle;
      }
    }

    .layout-container {
      background: white;
      min-width: 1080px;
      padding-top: 78px;
      #loginFrame {
        display: none;
        .login-mask {
          width: 100vw;
          height: 100vh;
          background: #000;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 991;
          opacity: 0.3;
          filter: alpha(opacity=30);
        }
        .close-button-vessel {
          z-index: 1000;
        }
        .login-frame {
          background: #ffffff;
          margin: auto;
          width: 390px;
          height: 299px;
          border: 0px;
          z-index: 999;
        }
      }
    }
  }
</style>
