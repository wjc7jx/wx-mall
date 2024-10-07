import http from '../utils/http'

/**
 * @description 授权登录
 * @param {*} code 临时登录凭证code
 * @returns Promise
 */
export const reqLogin = (code) => {
  return http.get(`/weixin/wxLogin/${code}`)
}

/**
 * @description 获取用户信息
 * @returns Promise
 */
export const reqUserInfo = () => {
  return http.get(`/weixin/getuserInfo`)
}


/**
 * @description 上传文件
 * @param {*} FilePath 要上传的资源路径
 * @param {*} name 要上传的资源key

 */
export const reqUploadFile=(FilePath,name)=>{
  return http.upload(
    '/fileUpload',
    FilePath,
    name
  )
}

/**
 * @description 更新用户信息
 * @param {*} updateUserVo 用户头像和用户昵称
 */
export const reqUpdateUserInfo = (updateUser) => {
  return http.post('/weixin/updateUser', updateUser)
}