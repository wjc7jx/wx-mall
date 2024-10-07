// pages/info/info.js  
import { ComponentWithStore } from 'mobx-miniprogram-bindings';  
import { userStore } from '@/store/index';  
  
ComponentWithStore({  
  storeBindings: {  
    store: userStore,  
    fields: ['token', 'userInfo']  
  },  
  
  // 页面的初始数据  
  data: {  
    // 初始化第二个面板数据  
    initpanel: [  
      {  
        url: '/pages/order/list/list',  
        title: '商品订单',  
        iconfont: 'icon-dingdan'  
      },  
      {  
        url: '/pages/order/list/list', // 注意：这里可能需要根据实际情况修改URL  
        title: '礼品卡订单',  
        iconfont: 'icon-lipinka'  
      },  
      {  
        url: '/pages/order/refund/refund', // 假设退款/售后的页面路径是 /pages/order/refund/refund  
        title: '退款/售后',  
        iconfont: 'icon-tuikuan'  
      }  
    ]  
  },  
  
  // 生命周期函数--监听页面加载  
  onLoad() {  
    // 可以在这里添加页面加载时需要执行的逻辑  
  },  
  
  // 跳转到登录页面  
  methods: {  
    toLoginPage() {  
      wx.navigateTo({  
        url: '/pages/login/login'  
      }); // 修正了原代码中的拼写错误 "jaing"  
    }  
  }  
});