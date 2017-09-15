<template>
  <div class="layout">
    <div class="layout-sidebar-header">
      <img class="header-left-image" src="../assets/logo.png" height="38"/>
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
        localStorage.setItem('accessToken', this.$route.query.a)
      }
      return {}
    },
    methods: {
      ...mapActions([])
    }
  }

</script>
<style lang="scss">
  .el-dialog {
    width: 456px;
    .el-dialog__body {
      padding: 12px 8px 6px 0px;
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
    }
  }
</style>
