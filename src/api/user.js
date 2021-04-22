import request from '@/utils/request'

// 统一鉴权登录获取菜单
export function buildMenus() {
  return request({
    url: '/getAppPermissionTree',
    method: 'get'
  })
}
