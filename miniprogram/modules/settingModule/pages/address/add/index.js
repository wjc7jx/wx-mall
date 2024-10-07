// 引入腾讯地图微信小程序JS SDK
import QQMapWX from '../../../../../libs/qqmap-wx-jssdk.min'
import Schema from 'async-validator'
import { reqAddAddress,reqUpdateAddress ,reqAddressInfo} from '../../../../../api/address'
// 定义页面
Page({

  // 页面的初始数据
  data: {
    name: '', // 收货人姓名
    phone: '', // 收货人手机号
    provinceName: '', // 省名称
    provinceCode: '', // 省编码
    cityName: '', // 市名称
    cityCode: '', // 市编码
    districtName: '', // 区名称
    districtCode: '', // 区编码
    address: '', // 详细地址（不含省市区）
    fullAddress: '', // 完整地址（含省市区）
    isDefault: 0 // 是否设置为默认地址，0：否，1：是
  },

  // 地址选择器变化时触发
  onAddressChange(event) {
    // 从事件对象中解构出省市区编码和名称
    const [provinceCode, cityCode, districtCode] = event.detail.code
    const [provinceName, cityName, districtName] = event.detail.value

    // 更新data中的省市区数据
    this.setData({
      provinceCode,
      provinceName,
      cityCode,
      cityName,
      districtName,
      districtCode
    })
  },

  // 保存地址信息
  async saveAddrssForm() {
    // 组织参数 (完整地址、是否设置为默认地址)
    const {
      provinceName,
      cityName,
      districtName,
      address,
      isDefault
    } = this.data
    // 最终需要发送的请求参数
    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: isDefault ? 1 : 0
    }
    // 调用方法对最终的请求参数进行验证
    const {valid} = await this.validateAddress(params)
    // 如果验证没有通过，不继续执行后续的逻辑
    if (!valid) return
      const res=this.addressId? await reqUpdateAddress(params) : await reqAddAddress(params)

    //添加地址
    // const res = await reqAddAddress(params)
    if (res.code === 200) {
      
      wx.navigateBack({
        success:()=> {//这里只能用箭头函数，否则this将指向函数而不是页面
          wx.toast({
            title: this.addressId ? '编辑收货地址成功' : '新增收货地址成功'
          })
        }
      })
    }

  },
  // 验证新增收货地址请求参数
  // 形参 params 是需要验证的数据
  validateAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'
    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    // 创建验证规则，验证规则是一个对象
    // 每一项是一个验证规则，验证规则属性需要和验证的数据进行同名
    const rules = {
      name: [{
          required: true,
          message: '请输入收货人姓名'
        },
        {
          pattern: nameRegExp,
          message: '收货人姓名不合法'
        }
      ],
      phone: [{
          required: true,
          message: '请输入收货人手机号'
        },
        {
          pattern: phoneReg,
          message: '手机号不合法'
        }
      ],
      provinceName: {
        required: true,
        message: '请选择收货人所在地区'
      },
      address: {
        required: true,
        message: '请输入详细地址'
      }
    }

    // 创建验证实例，并传入验证规则
    const validator = new Schema(rules)

    // 调用实例方法对数据进行验证
    // 注意：我们希望将验证结果通过 Promsie 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors, fields) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          wx.toast({
            title: errors[0].message
          })

          resolve({
            valid: false
          })
        } else {
          resolve({
            valid: true
          })
        }
      })
    })
  },


  // 获取用户地理位置信息
  async onLocation() {
    // 打开地图让用户选择地理位置
    const {
      latitude,
      longitude,
      name
    } = await wx.chooseLocation()

    // 使用腾讯地图的reverseGeocoder方法逆地址解析
    this.qqmapsdk.reverseGeocoder({
      location: {
        longitude,
        latitude
      },
      success: (res) => {
        // 从结果中获取省市区、省市区编码等信息
        const {
          adcode,
          province,
          city,
          district
        } = res.result.ad_info

        // 获取街道和门牌号
        const {
          street,
          street_number
        } = res.result.address_component

        // 获取标准地址
        const {
          standard_address
        } = res.result.formatted_addresses

        // 格式化并更新data中的地址信息
        this.setData({
          provinceName: province,
          provinceCode: adcode.replace(adcode.substring(2, 6), '0000'),
          cityName: city,
          cityCode: adcode.replace(adcode.substring(4, 6), '00'),
          districtName: district,
          districtCode: district && adcode,
          address: street + street_number + name,
          fullAddress: standard_address + name
        })
      },
      fail: (err) => {
        // 打印错误信息
        console.log(err)
      }
    })
  },

  // 页面加载生命周期函数
  onLoad: async function (options) {
    // 实例化腾讯地图API核心类，传入key
    this.qqmapsdk = new QQMapWX({
      key: 'JXMBZ-NFU3Z-GL4XO-TH7OC-IHJ36-TSFQG'
    })
  //如果参数带id，则为编辑页面。
  if(options.id){
    this.addressId=options.id
    // 编辑时需要的初始化
    // 动态设置当前页面的标题
     wx.setNavigationBarTitle({
       title: '更新收货地址'
     })
    //  获取初始化数据
    const { data } = await reqAddressInfo(this.addressId)
     // 将获取的数据进行赋值
     this.setData(data)
  }
  }
})