<template>
  <BaseMainLayout left-title='左标题' main-title='主标题'>
    <template v-slot:leftContent>
      <div>// TODO 左内容导航区域</div>
    </template>
    <template v-slot:mainContent>
      <div>// TODO 主内容展示区域</div>
    </template>
  </BaseMainLayout>
</template>

<script>
  import { apiPostTest } from '@/api/example/level2-menu1/index.js'
  export default {
    name: 'Level2Menu1',
    components: {},
    data() {
      return {}
    },
    mounted() {
      this.apiPostTest();
    },
    methods: {
      apiPostTest(){
        const params = {
          // paramA: 'fail'
        }
        // 接口调用
        apiPostTest(params).then(res => {
          // TODO 成功
          this.$GwiMessage.success(res.resultMessage)
        }).catch(msg => {
          // TODO 失败
          this.$GwiMessage.error(msg)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
