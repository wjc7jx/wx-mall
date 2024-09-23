import WxRequest from './request'
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