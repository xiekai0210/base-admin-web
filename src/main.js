import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
 // a modern alternative to CSS resets
import 'normalize.css/normalize.css'
import GwiUi from 'gwi-qy-ui'
import 'gwi-qy-ui/lib/theme/index.css'
import Element from 'element-ui'
import './styles/element-variables.scss'
 // global css
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import './permission'
// 引入iconfont
import '@/assets/iconfont/iconfont.css'
// 表格高度自适应指令
import adaptive from './directive/el-table/index.js'
// 容器高度自适应
import adaptiveHeight from './directive/adaptive-height/index.js'
// global filters
import * as filters from './filters'
import constant from './utils/constant.js'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/icon.css'

import SvgIcon from '@/components/SvgIcon'
Vue.component('svg-icon', SvgIcon)

Vue.use(adaptive)
Vue.use(adaptiveHeight)
Vue.use(GwiUi)
Vue.use(Element)

Vue.prototype.$constant = constant
const eventBus = new Vue()
Vue.prototype.$eventBus = eventBus

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
