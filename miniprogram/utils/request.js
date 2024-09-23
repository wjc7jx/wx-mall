import { toast, modal } from './extendApi'

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
    isLoading: false, // 默认是否显示loading
  }

  interceptors = {
    // 请求拦截器
    request: (config) => config,
    // 响应拦截器
    response: (response) => response
  }
  // 定义数组队列
  // 初始值需要是一个空数组，用来存储请求队列、存储请求标识
  queue = []

  /**
   * 构造函数，用于创建WxRequest实例
   * @param {Object} params - 构造函数参数，用于覆盖默认配置
   */
  constructor(params = {}) {
    WxRequest.default = { ...WxRequest.default, ...params };
  }
  // 封装处理并发请求的 all 方法
  all(...promise) {
    return Promise.all(promise)
  }
  /**
   * 发起网络请求的方法
   * @param {Object} options - 请求选项，包括url、method、header、data等
   * @returns {Promise} - 返回一个Promise对象，用于处理请求的响应
   */
  request(options) {
    // 如果有新的请求，则清空上一次的定时器
    this.timerId && clearTimeout(this.timerId)
    // 拼接完整的URL
    options.url = WxRequest.default.baseURL + options.url;
    // 合并默认配置和请求配置
    const options = { ...WxRequest.default, ...options };

    // 在发送请求之前调用请求拦截器
    options = this.interceptors.request(options)
    // 若为空则调用显示loading，否则不调用
    if(options.isLoading){
      // 发送请求之前添加 loading
      this.queue.length === 0 && wx.showLoading()
      this.queue.push('requesting')
    }


    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        // 当接口调用成功时会触发 success 回调函数
        success: (res) => {
          // 不管接口成功还是失败，都需要调用响应拦截器
          const mergeRes = Object.assign({}, res, { config: options, isSuccess: true })//在处理响应数据时，可能需要访问发送请求时使用的配置（例如，请求的 URL、方法、参数等），因此将配置对象添加到响应对象中
          resolve(this.interceptors.response(mergeRes))
        },
        // 当接口调用失败时会触发 fail 回调函数
        fail: (err) => {
          // 不管接口成功还是失败，都需要调用响应拦截器
          const mergeErr = Object.assign({}, err, { config: options, isSuccess: false })
          // 不管接口成功还是失败，都需要调用响应拦截器
          err = this.interceptors.response(mergeErr)
          reject(err)
        },
        complete: () => {

          if (!options.isLoading) return
          // 接口调用完成后隐藏 loading
          this.queue.pop()
          // 当前没有请求进行，临时创建一个添加一个标识，添加定时器以确认在100ms内没有新的请求发起，然后便隐藏loading
          this.queue.length === 0 && this.queue.push('request')
          this.timerId = setTimeout(() => {
            this.queue.pop()
            this.queue.length === 0 && wx.hideLoading()
          }, 100)
        }
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
});

// 配置请求拦截器
instance.interceptors.request = (config) => {
  // 从本地获取 token
  if (wx.getStorageSync('token')) {
    // 如果存在 token ，则添加请求头
    config.header['token'] = wx.getStorageSync('token')
  }

  // 返回请求参数
  return config
}

// 响应拦截器
instance.interceptors.response = async (response) => {
  const { data, isSuccess } = response
  if (!isSuccess) {
    if (!isSuccess) {
      toast({
        title: '网络异常请重试',
        icon: 'error'
      })
      // 抛出异常
      return Promise.reject(response)
    }
  }
  // 网络正常
  switch (data.code) {
    case 200:
      // 接口调用成功，服务器成功返回了数据，只需要将数据简化以后返回即可
      return data

    case 208:
      const res = await modal({
        content: '鉴权失败，请重新登录',
        showCancel: false
      })

      if (res) {
        // 既然用户需要重新进行登录，就需要把之前用户存储的信息(过期的 token) 进行清除
        // clearStorage()
        wx.clearStorageSync()

        wx.navigateTo({
          url: '/pages/login/login'
        })
      }


    default:
      toast({
        title: '程序出现异常，请联系客服或稍后重试！'
      })
      return Promise.reject(response)
  }
}


export default instance;

