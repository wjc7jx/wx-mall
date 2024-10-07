import {reqCategoryData}from '../../api/category'
Page({
  data:{
    categoryList:[],
    activeIndex:0,
  },
  updateActive(e){
    const {index}=e.currentTarget.dataset
    this.setData({
      activeIndex:index
    })
  },
  async getCattegoryData(){
    const res=await reqCategoryData()
    this.setData({
      categoryList:res.data
    })
  },
  
  onLoad(){
    this.getCattegoryData()
    console.log( this,this.data.categoryList )
  }
})
