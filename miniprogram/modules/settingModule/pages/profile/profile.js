// pages/profile/profile.js
import {userBehavior}from './behavior'
import {reqUploadFile,reqUpdateUserInfo}from '../../../../api/user'
Page({
  // 页面的初始数据
  behaviors:[userBehavior],
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },

  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      'userInfo.nickname':this.data.userInfo.nickname //因为点击取消表单会重置，再次进入时需要获取到store中的值，这样才能同步最新值
    })
  },
  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  },

  // 修改昵称
  getNewName(e){
    const {nickname} =e.detail.value
    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
  },

  // 修改头像
  async chooseAvatar(event){
    //获取到资源临时路径
    const {avatarUrl}=event.detail
    const res=await reqUploadFile(avatarUrl,'avatar')
    console.log(res)
    this.setData({
      'userInfo.headimgurl':avatarUrl
    })
  },

    // 更新用户信息
    async updateUserInfo() {
      console.log('点击了')
      // 调用 API，更新用户信息
      await reqUpdateUserInfo(this.data.userInfo)
      // 将用户信息存储到本地
      wx.setStorageSync('userInfo', this.data.userInfo)
      // 将用户信息存储到 Store
      this.setUserInfo(this.data.userInfo)
      // 给用户提示头像更新成功
      wx.showToast({
        title: '更新成功',
        icon: 'none'
      })
    }
})
