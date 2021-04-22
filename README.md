## 前序准备

**本地安装**：

* [node](http://nodejs.org/)
* [git](https://git-scm.com/)

**关键技术栈**：

* [ES2015+](http://es6.ruanyifeng.com/)
* [vue2.x](https://cn.vuejs.org/index.html)
* [vuex](https://vuex.vuejs.org/zh-cn/)
* [vue-router](https://router.vuejs.org/zh-cn/)
* [vue-cli](https://github.com/vuejs/vue-cli)
* [axios](https://github.com/axios/axios)
* [element-ui](https://github.com/ElemeFE/element) / [gwi-qy-ui](http://10.52.74.213:9030/)
* [mock.js](https://github.com/nuysoft/Mock)

## 目录结构
```
|— build                # 构建相关
|— mock                 # 模拟数据
|— public               # 静态资源
   |— config.js         # 配置文件：接口地址、版本号、统一鉴权开关
   |— favicon.ico       # 网站图标
   |_ index.html        # 默认渲染的主页文件
|— src                  # 开发源码目录
   |— api               # 全局接口请求
   |— assets            # 静态资源：字体、字体图标、图片
   |— components        # 全局公用组件
   |— directive         # 全局指令
   |— filters           # 全局过滤器
   |— layout            # 全局layout布局：头部栏、侧边栏、导航栏
   |— router            # 路由
   |— store             # 全局状态管理vuex
   |— styles            # 全局样式
   |— utils             # 全局工具类、常量类
   |— views             # 所有页面
   |— App.vue           # 主组件，入口页面
   |— main.js           # 入口文件，初始化
   |_ permission.js     # 权限管理，获取鉴权菜单
|— .env.development     # 开发环境变量
|— .env.production      # 生产环境变量
|— .eslintignore        # eslint过滤配置
|— .eslintrc.js         # eslint规则配置
|— .gitignore           # git过滤配置
|— babel.config.js      # babel配置
|— package.json         # package.json 依赖，项目基本信息
|— postcss.config.js    # postcss配置
|_ vue.config.js        # vue-cli 配置
```
## Mock Data
```
1、建议mock/与@api目录中定义的接口一一对应，每一个接口api应有对应的桩数据mock定义。
2、桩数据定义：
// 成功消息json数据定义
const successData = {
  "resultCode": "200",
  "resultMessage": "成功消息",
  "content": {}
}

// 桩数据三要素：url、type、response
{
  url: '/aaa/bbb/ccc',
  type: 'post',
  response: config => {
    // 获取参数（可选）
    const { paramA } = config.body
    if (paramA === 'fail') {
      return failData
    }
    return successData
  }
}

```

## 布局
```
@layout: 一级路由公共组件
@layout/AppMain: 二级路由载体
+————————————————————+               +————————————————————+
|     AppHeader      |               |layout              |
|--------------------|               |    |***************|
|    |  TagsViews    |      =>       |    |  xxx.vue      |
|Side|***************|               |    |               |
|bar |  AppMain      |               |    |***************|
|    |               |               +————————————————————+
|    |***************|
+————————————————————+
```
## 构建
**开发**
```
# 安装依赖
npm install

# 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev

#浏览器访问 http://localhost:9017
```
**发布**
```
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 构建生产环境包
npm run build:prod
```