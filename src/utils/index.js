/**
 * 下载excel文件
 * @param {文件流} data
 * @param {文件名称} filename
 */
export function downLoadXls(data, filename, type = 'xlsx') {
  let downType = type === 'xlsx' ? 'application/vnd.ms-excel' : 'application/.zip'
  var blob = new Blob([data], {
    type: downType
  })
  filename += '.' + type
  if (typeof window.chrome !== 'undefined') {
    // Chrome 浏览器
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
  } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE 浏览器
    downType = type === 'xlsx' ? 'application/force-download' : 'application/.zip'
    blob = new Blob([data], {
      type: downType
    })
    window.navigator.msSaveBlob(blob, filename)
  } else {
    // Firefox 浏览器
    downType = type === 'xlsx' ? 'application/force-download' : 'application/.zip'
    var file = new File([data], filename, {
      type: downType
    })
    window.open(URL.createObjectURL(file))
  }
}

export function downLoadImage(url, saveName) {
  function base64ToBlob(base64) {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const imgData = atob(arr[1])
    let n = imgData.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = imgData.charCodeAt(n)
    }
    return new Blob([u8arr], {
      type: mime
    })
  }
  if (window.navigator.msSaveBlob) {
    // IE浏览器兼容处理
    const image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function() {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      // 得到图片的base64编码数据
      const imgBase64 = canvas.toDataURL()
      // base64转blob
      const blob = base64ToBlob(imgBase64)
      window.navigator.msSaveBlob(blob, saveName)
    }
    image.src = url
  } else {
    // 谷歌浏览器 创建a标签 添加download属性下载
    const aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName
    aLink.click()
  }
}

export function downLoadBillFile(url) {
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.download = ''
  aLink.click()
}

/**
 * 数字转百分比
 * @param {数字} num
 */
export function numToRatio(num) {
  if (typeof num === 'undefined' || num === null || num === '') {
    return '--'
  } else {
    return (Number(num) * 100).toFixed(2)
  }
}

/**
 * el-table斑马纹样式
 */
export function tableRowClassName({
  rowIndex
}) {
  if (rowIndex % 2 !== 0) {
    return 'stripe-row'
  }
  return ''
}