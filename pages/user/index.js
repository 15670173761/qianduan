// 获取小程序实例
const app = getApp();
Page({
  // 定义页面数据
  data: {
    // 是否验证过用户信息，默认为1（已验证）
    is_check: 1,
    // 用户信息对象
    userinfo: {}
  },

  // 页面显示时触发的函数
  onShow() {
    // 调用获取用户信息函数
    this.getUserInfo()
  },

  // 获取用户信息函数
  getUserInfo() {
    // 发送请求获取用户信息
    app.util.request({
      url: '/user/getInfo' // 后端API接口地址
    }).then(res => {
      // 更新页面数据，包括用户信息和验证状态
      this.setData({
        userinfo: res.data,
        is_check: res.data.is_check
      })
    })
  },

  // 获取用户微信资料函数
  getUserProfile() {
    wx.getUserProfile({
      desc: '使用微信登录' // 获取用户授权时的提示文本
    }).then(e => {
      // 如果获取成功，发送请求更新用户头像
      if (!(e.errMsg.indexOf('fail') > 0)) {
        app.util.request({
          url: '/user/setUserAvatar', // 后端API接口地址
          data: {
            encryptedData: e.encryptedData, // 用户微信资料的加密数据
            iv: e.iv // 解密用户微信资料的初始向量
          }
        }).then(res => {
          // 更新用户信息
          this.getUserInfo()
        })
      } else {
        // 如果获取失败，提示授权失败
        app.util.message('授权失败', 'error') // 显示提示信息，第一个参数为提示文本，第二个参数为提示类型
      }
    }).catch(() => {
      // 异常处理
    })
  },

  // 获取用户手机号函数
  getUserPhone(e) {
    // 如果获取失败，提示错误信息并返回
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      var message = e.detail.errMsg
      if (message.indexOf('user deny') !== -1) {
        message = '已取消授权'
      }
      app.util.message(message, 'error')
      return
    }
    // 发送请求更新用户手机号
    app.util.request({
      url: '/user/setUserPhone', // 后端API接口地址
      data: {
        encryptedData: e.detail.encryptedData, // 用户手机号的加密数据
        iv: e.detail.iv // 解密用户手机号的初始向量
      }
    }).then(res => {
      // 更新用户信息
      this.getUserInfo()
    })
  },

  // 跳转页面函数
  linkto(e) {
    // 获取跳转路径并跳转页面
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },

  // 跳转到会员支付页面函数
  toPayVip() {
    wx.navigateTo({
      url: '/pages/pay/vip' // 要跳转的页面路径
    })
  },

  // 跳转到任务页面函数
  toTask() {
    wx.switchTab({
      url: '/pages/task/index' // 要跳转的页面路径
    })
  },

  // 跳转到修改昵称页面函数
  toInputNickname() {
    wx.navigateTo({
      url: '/pages/user/nickname'
    })
  }
})
