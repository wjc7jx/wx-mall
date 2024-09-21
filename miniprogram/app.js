import {toast,modal}from 'utils/extendApi'
import instance from 'utils/request' 
App({
  async onLaunch(){
    const res = await instance.request({
      url: '/index/findBanner',
      method: 'GET'
    })
    // console.log(res);
    const res1=await instance.get(
      '/index/findBanner'
    )
     console.log(res1);
    
  }
})
