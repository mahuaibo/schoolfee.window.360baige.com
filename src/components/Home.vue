<template>
  <div class="layout">
    <div class="layout-sidebar-header">
      <img class="header-left-image" src="../assets/logo.png" height="60" width="60"/>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .layout-sidebar-header {
    background: #324157;
    height: 78px;
    width: 100%;
    min-width: 1080px;
    position: absolute;
    left: 0;
    .header-left-image {
      float: left;
      padding-left: 192px;
    }
  }

  .layout-container {
    background: white;
    min-width: 1080px;
    height: calc(100vh - 100px);
    /*overflow: scroll;*/
    padding-top: 78px;
  }
</style>
