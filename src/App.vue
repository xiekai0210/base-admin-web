<template>
  <div id="app">
    <router-view :key="key" />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    key() {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return this.$route.path
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss">
  ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background-color: rgba(204,204,204,0.3);
  }
  ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      -webkit-box-shadow: inset 0 0 8px rgba(204,204,204,0.3);
      background-color: rgba(204,204,204,0.3)
  }
</style>
