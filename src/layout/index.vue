<template>
  <div :class="classObj" class="app-wrapper">
    <div class="app-header">
      <AppHeader />
    </div>
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div>
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Sidebar, TagsView, AppHeader } from './components'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    TagsView,
    AppHeader
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .app-header {
      width: 100%;
      height: 60px;
      position: fixed;
      z-index: 1001;
    }
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 14px)
  }
  
</style>
