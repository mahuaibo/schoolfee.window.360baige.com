<template>
  <div class="common-header">
    <!--<div class="el-menu-demo el-menu-demo-right">-->
      <!--<el-button @click="returnAppCenter">应用中心</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
      // 返回应用中心
      returnAppCenter () {
        window.location.href = 'http://localhost:8880/#/application/center'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-menu-demo-right {
    margin-top: 15px;
    position: absolute;
    right: 30px;
  }
</style>

