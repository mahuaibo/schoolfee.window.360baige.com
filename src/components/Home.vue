<template>
  <div class="layout">
    <div class="layout-sidebar-header">
      <common-header></common-header>
      <!--<img class="header-left-image" src="../assets/logo.png" height="38"/>-->
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
    }
  }
</style>
