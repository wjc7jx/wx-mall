import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/store/index'
import { reqCartList,reqUpdateChecked,reqCheckAllCart,reqAddCart,reqDelCart } from '@/api/cart'
import { behavior as computedBehavior } from 'miniprogram-computed'
import {swipeCellBehavior}from '@/behaviors/swipeCellBehavior'
import {debounce}from '../../utils/util'
ComponentWithStore({
     // 注册计算属性
  behaviors: [computedBehavior,swipeCellBehavior],
  storeBindings: {
    store: userStore,
    fields: ['token']
  },

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },
  computed: {
    // 判断是否全选
    // computed 函数中不能访问 this ，只有 data 对象可供访问
    // 这个函数的返回值会被设置到 this.data.selectAllStatus 字段中
    selectAllStatus(data) {
      return  data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
      },
          // 计算商品价格总和
    totalPrice(data) {
      let totalPrice = 0
      data.cartList.forEach((item) => {
        // 如果商品的 isChecked 属性等于，说明该商品被选中的
        if (item.isChecked === 1) {
          totalPrice += item.count * item.price
        }
      })
      return totalPrice
    }
  },
  // 组件的方法列表
  methods: {
   // 获取购物车列表数据 + 处理页面的展示
   async showTipGetList() {
     // 将 token 进行解构
     const { token } = this.data

     // 1. 如果没有登录，购物车列表，展示文案：您尚未登录，点击登录获取更多权益
     if (!token) {
       this.setData({
         emptyDes: '您尚未登录，点击登录获取更多权益',
         cartList: []
       })

       return
     }
 
     // 获取商品列表数据
     const { data: cartList, code } = await reqCartList()
 
     if (code === 200) {
       // 2. 如果用户登录，购物车列表为空，展示文案： 还没有添加商品，快去添加吧～
       this.setData({
         cartList,
         emptyDes:  '还没有添加商品，快去添加吧～'
       })
     }
   },
  //  切换商品的选中状态
  async updateChecked(event) {
    // 获取最新的选中状态
    const { detail } = event
    // 获取商品的索引和 id
    const { id, index } = event.target.dataset
    // 将最新的状态格式化成后端所需要的数据格式
    const isChecked = detail ? 1 : 0

    // 调用接口，传入参数，更新商品的状态
    const res = await reqUpdateChecked(id, isChecked)
    // 如果数据更新成功，需要将本地的数据一同改变
    if (res.code === 200) {
      this.setData({
        [`cartList[${index}].isChecked`]: isChecked
      })
    }
  },


  // 全选和全不选功能
    // 全选和全不选功能
    async updateAllStatus(event) {
      // 获取全选和全不选的状态
      const isChecked = event.detail ? 1 : 0
      // 调用接口，更新服务器中商品的状态
      const res = await reqCheckAllCart(isChecked)

      // 如果更新成功，需要将本地的数据一同改变
      if (res.code === 200) {
        // 将数据进行拷贝
        const newCart = JSON.parse(JSON.stringify(this.data.cartList))
        // 将数据进行更改
        newCart.forEach((item) => (item.isChecked = isChecked))

        // 进行赋值
        this.setData({
          cartList: newCart
        })
      }
    },
    // 更新购买的数量
  changeBuyNum: debounce(async function (event) {
  // 获取最新的购买数量，
  // 如果用户输入的值大于 200，购买数量需要重置为 200
  // 如果不大于 200，直接返回用户输入的值
  let buynum = event.detail > 200 ? 200 : event.detail
  // 获取商品的 ID 和 索引
  const { id: goodsId, index, oldbuynum } = event.target.dataset
  // 验证用户输入的值，是否是 1 ~ 200 之间的正整数
  const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/

  // 对用户输入的值进行验证
  const regRes = reg.test(buynum)

  // 如果验证没有通过，需要重置为之前的购买数量
  if (!regRes) {
    this.setData({
      [`cartList[${index}].count`]: oldbuynum
    })

    return
  }

  // 如果通过，需要计算差值，然后将差值发送给服务器，让服务器进行逻辑处理
  const disCount = buynum - oldbuynum

  // 如果购买数量没有发生改变，不发送请求
  if (disCount === 0) return

  // 发送请求：购买的数量 和 差值
  const res = await reqAddCart({ goodsId, count: disCount })

  // 服务器更新购买数量成功以后，更新本地的数据
  if (res.code === 200) {
    this.setData({
      [`cartList[${index}].count`]: buynum
    })
  }
},500),
   // 删除购物车中的商品
   async delCartGoods(event) {
     // 获取需要删除商品的 id
     const { id } = event.currentTarget.dataset
 
     // 询问用户是否删除该商品
     const modalRes = await wx.modal({
       content: '您确认删除该商品吗 ?'
     })
 
     if (modalRes) {
       await reqDelCart(id)
 
       this.showTipGetList()
     }
   },

  onHide() {
    // 在页面隐藏的时候，需要让删除滑块自动弹回
    this.onSwipeCellClose()
  },
// 页面展示时触发
onShow() {
  this.showTipGetList()
}
  }
})
