import http from '../utils/http'

/**
 * @description 实现新增收货地址
 * @param {*} data
 * @returns Promise
 */
export const reqAddAddress = (data) => {
  return http.post('/userAddress/save', data)
}

/**
 * @description 获取收货地址列表
 * @returns Promise
 */
export const reqAddressList = () => {
  return http.get('/userAddress/findUserAddress')
}

/**
 * @description 获取收货地址详情
 * @param {*} id 收货地址id
 * @returns Promise
 */
export const reqAddressInfo = (id) => {
  return http.get(`/userAddress/${id}`)
}

/**
 * @description 编辑收货地址
 * @param {*} data
 * @returns Promise
 */
export const reqUpdateAddress = (data) => {
  return http.post('/userAddress/update', data)
}

/**
 * @description 删除收货地址
 * @param {*} id 收货地址 id
 * @returns Promise
 */
export const reqDelAddress = (id) => {
  return http.get(`/userAddress/delete/${id}`)
}
