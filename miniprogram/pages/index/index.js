import { reqIndexData } from '@/api/index'
Page({
    data: {
        bannerList: [],//轮播图
        categoryList: [],//分类导航
        activeList: [],//活动宣传
        guessList: [],//猜你喜欢
        hotList: [],//人气推荐
        loading:true
    },
    async getIndexData() {
      // 调用接口，获取首页数据
      // 数组每一项是 Promise 产生的结果，并且是按照顺序返回。
      const res = await reqIndexData()
      // 在获取数据以后，对数据进行赋值
      this.setData({
        bannerList: res[0].data,  
        categoryList: res[1].data,  
        activeList: res[2].data,  
        hotList: res[3].data,  
        guessList: res[4].data,  
        loading:false
      })
    },
    onLoad() {
        this.getIndexData()
    }
})
