<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="tags-view-content">
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <div class="arrow-left" @click="tagPrev()">
        <i class="iconfont iconleft-kong" />
      </div>
      <scroll-pane ref="scrollPane" class="tags-view-wrapper">
        <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path" :class="isActive(tag)?'active':''" :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span" class="tags-view-item" @click="selectTag(tag)" @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @contextmenu.prevent.native="openMenu(tag,$event)">
          {{ tag.title }}
          <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
        </router-link>
      </scroll-pane>
      <!-- <div class="left">
        <i class="iconfont iconleft-kong" />
      </div> -->
      <div class="arrow-right" @click="tagNext()">
        <i class="iconfont iconright-kong" />
      </div>
      <div class="close" @click="closeAllTags(selectedTag)">
        <i class="iconfont iconclose-guanbiquanbu" />
      </div>
      <div class="refresh" @click="refreshSelectedTag(selectedTag)">
        <i class="iconfont iconrefresh" />
      </div>
    </div>

    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他标签页</li>
      <li @click="closeAllTags(selectedTag)">关闭所有标签页</li>
    </ul>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import ScrollPane from './ScrollPane'
  import path from 'path'
  import Hamburger from '@/components/Hamburger'

  export default {
    components: {
      ScrollPane,
      Hamburger
    },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: []
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      },
      routes() {
        return this.$store.state.permission.routes
      },
      ...mapGetters([
        'sidebar'
      ])
    },
    watch: {
      $route() {
        this.addTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.initTags()
      this.addTags()
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
        // setTimeout(() => {
        //   this.$eventBus.$emit('resize');
        //   var evt = document.createEvent("HTMLEvents");
        //   evt.initEvent("resizeCusEvent", false, false);
        //   window.dispatchEvent(evt);
        // }, 600)
      },
      isActive(route) {
        if (route.path === this.$route.path) {
          this.selectedTag = route
          return true
        }
        return false
      },
      isAffix(tag) {
        return tag.meta && tag.meta.affix
      },
      filterAffixTags(routes, basePath = '/') {
        let tags = []
        routes.forEach(route => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta
              }
            })
          }
          if (route.children) {
            const tempTags = this.filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags]
            }
          }
        })
        return tags
      },
      initTags() {
        const affixTags = this.affixTags = this.filterAffixTags(this.routes)
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            this.$store.dispatch('tagsView/addVisitedView', tag)
          }
        }
      },
      addTags() {
        const {
          name
        } = this.$route
        if (name) {
          this.$store.dispatch('tagsView/addView', this.$route)
        }
        return false
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag)
              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('tagsView/updateVisitedView', this.$route)
              }
              break
            }
          }
        })
      },
      refreshSelectedTag(view) {
        this.$store.dispatch('tagsView/delCachedView', view).then(() => {
          const {
            fullPath
          } = view
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('tagsView/delView', view).then(({
          visitedViews
        }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag)
        this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags(view) {
        this.$store.dispatch('tagsView/delAllViews').then(({
          visitedViews
        }) => {
          if (this.affixTags.some(tag => tag.path === view.path)) {
            return
          }
          this.toLastView(visitedViews, view)
        })
      },
      toLastView(visitedViews, view) {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView.fullPath)
        } else {
          // now the default is to redirect to the home page if there is no tags-view,
          // you can adjust it according to your needs.
          if (view.name === 'ServiceConfigurationManagement') {
            // to reload home page
            this.$router.replace({
              path: '/redirect' + view.fullPath
            })
          } else {
            this.$router.push('/')
          }
        }
      },
      tagPrev() {
        const view = this.selectedTag
        const visited_Views = this.visitedViews
        if (visited_Views.length <= 1) {
          return false
        }
        if (view.name === visited_Views[0].name) {
          return false
        }
        for (let i = 0; i < visited_Views.length; i++) {
          if (visited_Views[i + 1].name === view.name) {
            this.$router.push(visited_Views[i].fullPath)
            return true
          }
        }
      },
      tagNext() {
        const view = this.selectedTag
        const visited_Views = this.visitedViews
        if (visited_Views.length <= 1) {
          return false
        }
        if (view.name === visited_Views[visited_Views.length - 1].name) {
          return false
        }
        for (let i = visited_Views.length - 1; i >= 0; i--) {
          if (visited_Views[i - 1].name === view.name) {
            this.$router.push(visited_Views[i].fullPath)
            return true
          }
        }
      },
      openMenu(tag, e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 10 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }

        this.top = e.clientY - 55
        this.visible = true
        this.selectedTag = tag
      },
      closeMenu() {
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tags-view-container {
    height: 40px;
    width: 100%;
    background: #fff;

    .tags-view-content {
      display: flex;
      margin-top: 4px;
    }

    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        border-right: 1px solid #F1F1F1;
        border-top: 2px solid rgba(255, 255, 255, 0.2);
        color: #3C3C3C;
        background: #fff;
        padding: 0 10px;
        font-size: 12px;

        &:first-of-type {}

        &:last-of-type {
          margin-right: 15px;
        }

        &.active {
          background-color: #FBFDFF;
          border-top: 2px solid #3591FC;
        }
      }
    }

    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }

    .hamburger-container {
      border-left: 1px solid #F1F1F1;
      line-height: 40px;
      height: 40px;
      float: left;
      cursor: pointer;
      flex: 1;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: #F1F1F1
      }
    }

    .arrow-left {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      float: left;
      cursor: pointer;
      flex: 1;
      border-left: 1px solid #F1F1F1;
      border-right: 1px solid #F1F1F1;

      &:hover {
        background: #F1F1F1
      }
    }

    .arrow-right {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      float: right;
      cursor: pointer;
      flex: 1;
      border-left: 1px solid #F1F1F1;

      &:hover {
        background: #F1F1F1
      }
    }

    .close {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      float: right;
      cursor: pointer;
      flex: 1;
      border-left: 1px solid #F1F1F1;

      &:hover {
        background: #F1F1F1
      }
    }

    .refresh {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      float: right;
      cursor: pointer;
      flex: 1;
      border-left: 1px solid #F1F1F1;

      &:hover {
        background: #F1F1F1
      }
    }

    .left {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      float: right;
      border-left: 1px solid #F1F1F1;
      border-right: 1px solid #F1F1F1;
    }
  }
</style>

<style lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        background-color: #CCCCCC;
        color: #fff;
        width: 14px;
        height: 14px;
        margin-left: 10px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        vertical-align: 1px;

        &:before {
          transform: scale(1.0);
          display: inline-block;
          vertical-align: -1px;
        }

        &:hover {
          background-color: #666666
        }
      }
    }
  }
</style>
