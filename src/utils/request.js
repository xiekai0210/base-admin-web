import axios from 'axios'
import GWIUI from 'gwi-qy-ui'

const baseURL = window.BASE_API
// create an axios instance
const service = axios.create({
  baseURL: baseURL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 * 3 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (typeof(config.params) !== 'undefined') {
      config.timeout = config.params.timeout || config.timeout
    }

    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const data = response.data
    // 判断是否是下载类型
    if (data.byteLength === 0) {
      GWIUI.GwiMessage.error('没有数据,不能导出')
      return Promise.reject('error')
    }
    if (response.headers['content-type'].indexOf('excel') !== -1) {
      const excelResponse = {
        type: 'xlsx',
        data: data
      }
      return excelResponse
    }
    if (response.headers['content-type'].indexOf('octet-stream') !== -1) {
      const zipResponse = {
        type: 'zip',
        data: data
      }
      return zipResponse
    }

    const res = response.data
    // 统一鉴权登录拦截
    if(Number(res.resultCode) === 401){
      window.location.href = res.loginUrl
      return
    }

    // 导入文件成功会出现undefined的情况, 成功码默认200.
    if (typeof (res.resultCode) !== 'undefined' && Number(res.resultCode) !== 200) {
      return Promise.reject(res.resultMessage)
    } else {
      return res
    }
  },
  error => {
    GWIUI.GwiMessage.error('接口调用失败，请确认后台服务是否运行正常')
    return Promise.reject(error)
  }
)

export default service
