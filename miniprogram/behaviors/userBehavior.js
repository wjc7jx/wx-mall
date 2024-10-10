// 导入 BehaviorWithStore 让页面和 Store 对象建立关联
import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
// 导入用户 Store
import { userStore } from '@/store/index'

export const userBehavior = BehaviorWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token']
  }
})


