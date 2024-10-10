// pages/address/list/index.js'
import { reqAddressList,reqDelAddress } from '@/api/address'
import {swipeCellBehavior} from '@/behaviors/swipeCellBehavior'

Page({
  // 页面的初始数据
  data: {
    addressList: [],
  },
  behaviors:[swipeCellBehavior],
  // 获取收货地址
  async getAddressList() {
    // 调用 API，获取收货地址
    const { data: addressList } = await reqAddressList()

    this.setData({
      addressList
    })
  },
  // 去编辑页面
  toEdit(event) { 
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },
  // 删除
  async delAddress(event){
    const id = event.currentTarget.dataset.id
    await reqDelAddress(id)
    this.getAddressList()
  },


  onShow(){
    this.getAddressList()
  }
  

})
