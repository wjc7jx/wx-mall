import http from '../utils/http'

/**
 * 通过并发请求获取首页的数据
 */
export const reqCategoryData = () => {
  return http.get('/index/findCategoryTree')
}
