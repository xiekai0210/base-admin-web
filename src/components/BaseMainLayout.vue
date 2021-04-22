<template>
  <div class="main">
    <div v-if="$slots.leftContent" class="main-chunk" :style="{ width: leftWidth }">
      <div class="header">
        <div v-if="leftTitle" class="header-title">
          {{ leftTitle }}
        </div>
      </div>
      <slot name="leftContent"></slot>
    </div>

    <div v-if="$slots.leftContent" class="main-line"></div>

    <div class="main-chunk" :class="[ 
          mainFlex ? 'main-chunk--flex' + mainFlex : '', 
        ]">
      <div class="header">
        <div v-if="mainTitle" class="header-title">
          {{ mainTitle }}
        </div>
      </div>
      <slot name="mainContent"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseMainLayout',
    props: {
      leftTitle: {
        type: String,
      },
      mainTitle: {
        type: String,
      },
      leftWidth: {
        type: String,
        default: '270px'
      },
      mainFlex: {
        type: String,
        default: '1'
      }
    },
  }
</script>

<style lang="scss" scoped>

  .main {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;

    &-chunk {
      background: #FFFFFF;
      box-shadow: 0px 0px 4px 0px rgba(124, 124, 124, 0.35);
      border-radius: 3px;
      overflow: auto;
      padding: 26px 20px 0 20px;

      &--flex1 {
        flex: 1;
      }
    }

    &-line {
      height: 100%;
      width: 10px;
      background-color: $back-main;
    }
  }
</style>
