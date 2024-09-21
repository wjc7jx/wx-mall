class WxRequest {
  // 默认配置对象
  static default = {
    baseURL: '', // 默认基础URL
    method: 'GET', // 默认请求方法
    header: {
      'content-type': 'application/json', // 默认的请求头内容类型
    },
    data: null, // 默认请求数据
    timeout: 60000, // 默认超时时间（毫秒）
  }

  /**
   * 构造函数，用于创建WxRequest实例
   * @param {Object} params - 构造函数参数，用于覆盖默认配置
   */
  constructor(params = {}) {
    WxRequest.default = { ...WxRequest.default, ...params };
  }

  /**
   * 发起网络请求的方法
   * @param {Object} options - 请求选项，包括url、method、header、data等
   * @returns {Promise} - 返回一个Promise对象，用于处理请求的响应
   */
  request(options) {
    // 拼接完整的URL
    options.url = WxRequest.default.baseURL + options.url;
    // 合并默认配置和请求配置
    const finalOptions = { ...WxRequest.default, ...options };
    return new Promise((resolve, reject) => {
      wx.request({
        ...finalOptions,
        success: resolve, // 直接使用resolve作为成功回调
        fail: reject, // 直接使用reject作为失败回调
      })
    })
  }

  // 封装GET实例方法
  get(url, data, config) {
    return this.request(
      Object.assign({
        url,
        method: 'GET',
        data,
      }, config)
    )
  }
  post(url, data, config) {
    return this.request(
      Object.assign({
        url,
        method: 'POST', // 
        data,
      }, config)
    )
  }
  put(url, data, config) {
    return this.request(
      Object.assign({
        url,
        method: 'PUT', // 
        data,
      }, config)
    )
  }
  delete(url, data, config) {
    return this.request(
      Object.assign({
        url,
        method: 'DELETE', // 
        data,
      }, config)
    )
  }

  // 其他方法(post, put, delete)保持不变...
}

// 创建WxRequest实例，并传递基础配置
const instance = new WxRequest({
  baseURL: 'https://gmall-prod.atguigu.cn/mall-api', // 设置基础URL
  timeout: 60000 // 设置超时时间
});

  export default instance;

