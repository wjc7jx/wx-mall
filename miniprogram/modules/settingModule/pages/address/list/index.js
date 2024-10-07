// pages/address/list/index.js'
import { reqAddressList,reqDelAddress } from '@/api/address'

Page({
  // 页面的初始数据
  data: {
    addressList: [],
    openedSwipCellId:null
  },
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
// 1.打开滑块时，将实例存储到队列中
onSwipeCellOpen(e){
  console.log(e)
  
  this.setData({
    openedSwipCellId:e.target.id
  })
  console.log(this.data.openedSwipCellId)
},
//2.点击页面时，关掉开启的滑块
onSwipeCellClose() {
  this.selectComponent(`#${this.data.openedSwipCellId}`).close()
    // 将存储打开的滑块清空
  this.setData({
    openedSwipCellId:null
  })
},

  onShow(){
    this.getAddressList()
  }
  

})
