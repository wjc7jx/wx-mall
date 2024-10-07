import { reqLogin,reqUserInfo } from '../../api/user'
import { toast } from '../../utils/extendApi'
import {userStore} from '../../store/index'
import {setStorage}from '../../utils/storage'
import { ComponentWithStore } from 'mobx-miniprogram-bindings'



ComponentWithStore({
    
     storeBindings: {
       store: userStore,
       fields: ['token','userInfo'],
       actions: ['setToken','setUserInfo']
     },
  
     methods: {
      // 授权登录
      login() {
        // 使用 wx.login 获取用户的临时登录凭证 code
        wx.login({
          success: async ({ code }) => {
            if (code) {
              // 在获取到临时登录凭证 code 以后，需要传递给开发者服务器
              const { data } = await reqLogin(code)
              // 登录成功以后，需要将服务器响应的自定义登录态存 储到本地
              setStorage('token', data.token)
              
               // 将数据存储到 store 对象中
               this.setToken(data.token)
              // 获取用户信息
              this.getUserInfo()
               // 返回之前的页面
                wx.navigateBack()
            } else {
              toast({ title: '授权失败，请重新授权' })
            }
          }
        })
      },
          // 获取用户信息
    async getUserInfo() { 
      const { data } = await reqUserInfo()
      console.log(data)
      // 将用户信息存储到本地
      setStorage('userInfo', data)
     // 将用户信息存储到 Store
     this.setUserInfo(data)
    }
  
     }
  })
