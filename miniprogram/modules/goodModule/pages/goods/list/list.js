// pages/goods/list/index.js
import {
  reqGoodsList
} from '@/api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    total: 0, // 数据总条数
    isFinish: false, // 判断数据是否加载完毕
    isLoading: false, // 判断数据是否记载完毕
    // 接口请求参数
    requestData: {
      page: 1, // 页码
      limit: 10, // 每页请求多少条数据
      category1Id: '', // 一级分类 id
      category2Id: '' // 二级分类 id
    }
  },
  // 获取商品列表的数据
  async getGoodsList() {
    // 数据正在请求中
    this.data.isLoading = true
    // 调用 API 获取数据
    const {
      data
    } = await reqGoodsList(this.data.requestData)
    // 数据加载完毕
    this.data.isLoading = false
    console.log(data)
    // 将返回的数据赋值给 data 中的变量
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },



  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 接收传递的参数
    Object.assign(this.data.requestData, options)
    // 获取商品列表的数据
    this.getGoodsList()
  },
  // 监听页面的上拉操作
  onReachBottom() {
    // 判断是否加载完毕，如果 isLoading 等于 true
    // 说明数据还没有加载完毕，不加载下一页数据
    if (this.data.isLoading) return
    
    let {page} = this.data.requestData
    let {goodsList,total}=this.data
    // 检测是否更新完毕
    if(goodsList.length===total){
      // 列表等于总数，表明获取完成，
      this.setData({
        isFinish:true
      })
      return
    }
    // 页码 +1
    this.setData({
      requestData: {
        ...this.data.requestData,
        page: page + 1
      }
    })

    // 重新发送请求
    this.getGoodsList()
  },
// 监听页面的下拉刷新
onPullDownRefresh() {
  // 将数据进行重置
  this.setData({
    goodsList: [],
    total: 0,
    isFinish: false,
    requestData: { ...this.data.requestData, page: 1 }
  })

  // 重新获取列表数据
  this.getGoodsList()
    //手动关闭下拉效果
  wx.stopPullDownRefresh()
}
})