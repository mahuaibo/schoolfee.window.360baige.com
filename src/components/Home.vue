<template>
  <div class="layout">
    <div class="layout-sidebar-header">
      <div class="layout-sidebar-header-left">
        <img src="../assets/logo.png" height="60" width="60"/>
        <label class="layout-sidebar-header-left-text">百鸽·<label style="font-size: 14px;">管理平台</label></label>
      </div>
      <div class="layout-sidebar-header-right"></div>
      <b class="layout-sidebar-header-title">校园收费系统</b>
      <div class="layout-sidebar-header-button">
        <common-header></common-header>
      </div>
    </div>
    <div class="layout-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import CommonHeader from '@/components/common/Header'
  export default {
    computed: {
      ...mapGetters([])
    },
    components: {CommonHeader},
    data () {
      if (this.$route.query.a) {
        localStorage.setItem('positionAccessToken', this.$route.query.a)
      }
      return {}
    },
    methods: {
      ...mapActions([])
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .layout-sidebar-header {
    height: 100vh;
    .layout-sidebar-header-left {
      background: #324157;
      height: 60px;
      width: 20%;
      position: absolute;
      left: 0;
      .layout-sidebar-header-left-text {
        color: #ffffff;
        font-weight: bold;
        position: relative;
        left: 0px;
        top: -20px;
      }
    }
    .layout-sidebar-header-right {
      background: #324157;
      height: 60px;
      width: 80%;
      position: absolute;
      right: 0;
    }
    .layout-sidebar-header-title {
      height: 60px;
      width: 20%;
      line-height: 60px;
      position: absolute;
      left: 0;
      top: 60px;
      border-bottom: 1px solid #f0f0f1;
    }
    .layout-sidebar-header-button {
      border-bottom: 1px solid #f0f0f1;
      height: 60px;
      width: 80%;
      position: absolute;
      right: 0;
      top: 60px;
    }
  }

  .layout-container {
    position: absolute;
    top: 120px;
    width: 98%;
    height: calc(100vh - 121px);
    overflow: scroll;
    margin-left: 1%;
    .loginBox-left {
      width: 20%;
      height: 100%;
      position: absolute;
      left: 0px;
      overflow: scroll;
    }
    .loginBox-right {
      width: 80%;
      height: 100%;
      position: absolute;
      right: 0px;
      overflow: scroll;
    }
  }
</style>
