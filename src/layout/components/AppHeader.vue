<template>
  <div class="headBox">
    <div class="headLeft">
      <img src="@/assets/images/appLogo.png">
      <span>{{ title }}</span>
    </div>

    <div class="headRight">
      <el-dropdown trigger="click" style="float: right;">
        <div class="circle-icon-btn width120">
          <div class="icon">
            <svg-icon icon-class="members" />
          </div>
          <span class="text">个人中心</span>
          <i class="iconfont iconarrow_down arrow"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="goUserInfo">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      title: this.$constant.PROJECT_TITLE
    }
  },
  methods: {
    logout() {
      window.location.href = `${window.BASE_API}/logout`
    },
    goUserInfo() {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.headBox {
  position: relative;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  text-align: left;
  height: 60px;
  background: linear-gradient(90deg, #47B8FF, #2A8DFF);
}
.headLeft {
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
  span {
    font-size: 24px;
    color: #fff;
    margin-left: 24px;
  }
}
.headRight {
  float: right;
  margin-top: 15px;
}
</style>
