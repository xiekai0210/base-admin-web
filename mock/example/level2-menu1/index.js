const successData = {
  "resultCode": "200",
  "resultMessage": "成功消息",
  "content": {}
}

const failData = {
  "resultCode": "!200",
  "resultMessage": "失败消息",
  "content": {}
}

export default [{
  url: '/aaa/bbb/ccc',
  type: 'post',
  response: config => {
    const { paramA } = config.body
    if (paramA === 'fail') {
      return failData
    }
    return successData
  }
}]