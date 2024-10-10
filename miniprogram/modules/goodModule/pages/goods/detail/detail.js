// pages/goods/detail/index.js
import {
  reqGoodsInfo
} from '@/api/goods'
import {
  userBehavior
} from '@/behaviors/userBehavior'
import {
  reqAddCart,
  reqCartList
} from '@/api/cart'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, //是否立即购买
    allCount: '' // 购物车商品总数量
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({
      show: false
    })
  },
  // 获取商品详情
  async getGoodsInfo() {
    // 调用接口、传入参数、获取商品详情
    const {
      data: goodsInfo
    } = await reqGoodsInfo(this.goodsId)
    this.setData({
      goodsInfo
    })
  },
  // 预览商品图片
  previewImg() {
    // 调用预览图片的 API
    wx.previewImage({
      current: this.data.goodsInfo.imageUrl, // 当前显示图片的http链接
      urls: this.data.goodsInfo.detailList // 需要预览的图片http链接列表

    })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    this.setData({
      count: Number(event.detail)
    })
  },
  //点击确认按钮
  async handleSubmit() {
    const {
      token,
      count,
      blessing,
      buyNow
    } = this.data;
    const goodsId = this.goodsId
    // 解构获取数据
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    // 验证购买数量的正则
    const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
    // 使用正则验证
    const res = reg.test(count) //JS中用于测试字符串是否匹配正则表达式的方法
    if (!res) return
    // 加入购物车
    if (buyNow === 0) {
      const res = await reqAddCart({
        goodsId,
        count,
        blessing
      })
      if (res.code === 200) {
        wx.showToast({
          title: '加入购物车成功'
        })

        // 购物车购买数量合计
        this.getCartCount()

        this.setData({
          show: false
        })
      }
    } else {
      // 立即购买
      wx.navigateTo({
        url: `/pages/order/detail/index?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },
  // 计算购买数量
  async getCartCount() {
    if (!this.data.token) return
    const res = await reqCartList()
    if (res.data.length !== 0) {
      // 购物车商品累加
      let allCount = 0
      // 获取购物车商品数量
      res.data.forEach((item) => {
        allCount += item.count
      })
      // 将购物车购买数量赋值
      this.setData({
        // 展示的数据要求是字符串
        allCount: (allCount > 99 ? '99+' : allCount) + ''
      })
      console.log(this.data.allCount)
    }

  },




  onLoad(options) {
    this.goodsId = options.goodsId ? options.goodsId : '' //将参数id赋值给页面goodsId
    this.getGoodsInfo()
    // 计算购买数量
    this.getCartCount()
  }
})