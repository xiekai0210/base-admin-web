import { CONSTANT_ROUTES, ASYNC_ROUTES } from '@/router'
import { buildMenus } from '@/api/user'
import Layout from '@/layout'

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = CONSTANT_ROUTES.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let asyncRoutes = []
      // 本地联调获取本地菜单
      if(!window.IS_AUTH_LOGIN) {
        asyncRoutes = ASYNC_ROUTES
        commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
        return
      }
      
      buildMenus().then((res) => {
        asyncRoutes = generaMenu(asyncRoutes, res.content)
        if (asyncRoutes.length > 0) {
          asyncRoutes[0].children[0].meta.affix = true
        }
        asyncRoutes.push({
          path: '*',
          redirect: '/404',
          hidden: true
        })
        // 预留权限控制逻辑
        if (roles.includes('admin')) {
          commit('SET_ROUTES', asyncRoutes)
        }
        resolve(asyncRoutes)
      })
    })
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */

export function generaMenu(routes, data) {
  data.forEach((item, index) => {
    const menu = {
      path: item.routerPath,
      component: item.viewPath === '#' ? Layout : resolve => require([`@/views/${item.viewPath}`], resolve),
      children: [],
      name: item.routerName,
      meta: {
        title: item.name,
        icon: item.icon
      }
    }
    if (item.viewPath !== '#') {
      menu.meta.noCache = true
    }
    if (index === 0) {
      if (item.children && item.children.length > 0) {
        menu.redirect = item.children[0].routerPath
        menu.path = '/'
        menu.alwaysShow = true
      }
    }
    if (item.children && item.children.length > 0) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
  return routes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
