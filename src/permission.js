import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import constant from '@/utils/constant.js'

NProgress.configure({
  showSpinner: false
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)
  
  if (store.getters.routes.length === 0) {
    const roles = ['admin']
    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
    if (accessRoutes.length === 0) {
      next()
    } else {
      router.addRoutes(accessRoutes)
      next({ ...to, replace: true })
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

function getPageTitle(pageTitle) {
  const title = constant.PROJECT_TITLE
  if (pageTitle) {
    return `${title}-${pageTitle}`
  }
  return `${title}`
}