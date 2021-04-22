import request from '@/utils/request'

// post接口定义
export function apiPostTest(data) {
  return request({
    url: `/aaa/bbb/ccc`,
    method: 'post',
    data
  })
}

// get接口定义
export function apiGetTest(param1) {
  return request({
    url: `/aaa/bbb/ccc?ddd=${param1}`,
    method: 'get'
  })
}
