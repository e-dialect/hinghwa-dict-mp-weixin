const app = getApp()

Page({
  data: {
    is_pwd1: true,
    is_pwd2: true,
    email: ''
  },

  ear1() {
    if (this.data.is_pwd1 == true) {
      this.setData({
        is_pwd1: false
      })
    } else {
      this.setData({
        is_pwd1: true
      })
    }
  },

  ear2() {
    if (this.data.is_pwd2 == true) {
      this.setData({
        is_pwd2: false
      })
    } else {
      this.setData({
        is_pwd2: true
      })
    }
  },

  getEmail(e) {
    this.setData({
      email: e.detail.value
    })
  },

  // 获取验证码
  getCode() {
    var that = this
    wx.request({
      url: app.globalData.server + 'website/email',
      method: 'POST',
      data: {
        email: that.data.email
      },
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res.data)
        if ((res.statusCode).toString()[0] === '2') {
          wx.showToast({
            title: '发送成功',
          })
        } else {
          wx.showToast({
            title: '发送失败',
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  },

  register(e) {
    console.log(e)
    var username = e.detail.value.username
    var password = e.detail.value.password
    var password_confirmed = e.detail.value.password_confirmed
    var email = e.detail.value.email
    var code = e.detail.value.code
    if (!username || !password || !password_confirmed || !email || !code) {
      wx.showToast({
        title: '信息不完整',
        icon: 'error',
      })
      return;
    }
    if (password.length < 6 || password.length > 11) {
      wx.showToast({
        title: '密码长度6~11位',
        icon: 'error',
      })
      return;
    }
    if (password != password_confirmed) {
      wx.showToast({
        title: '两次密码不相同',
        icon: 'error',
      })
      return;
    }
    wx.request({
      url: app.globalData.server + 'users',
      method: 'POST',
      data: {
        username: username,
        password: password,
        email: email,
        code: code,
        avatar: app.globalData.userInfo.avatar,
        nickname: app.globalData.userInfo.nickname
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '注册成功',
          })
          wx.setStorageSync('id', res.data.id)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 500)
        } else if (res.statusCode == 401) {
          wx.showToast({
            title: '验证码错误',
          })
        } else if (res.statusCode == 409) {
          wx.showToast({
            title: '用户名重复',
          })
        } else if (res.statusCode == 400) {
          wx.showToast({
            title: '请求有误',
          })
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: '服务器错误',
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  }
})