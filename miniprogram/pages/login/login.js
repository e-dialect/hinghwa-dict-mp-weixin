const app = getApp()

Page({
  data: {},

  login(e) {
    var username = e.detail.value.username
    var password = e.detail.value.password
    if (!username || !password) {
      wx.showToast({
        title: '信息不完整',
        icon: 'error'
      })
      return;
    }
    wx.request({
      url: app.globalData.server + 'login',
      method: 'POST',
      data: {
        username: username,
        password: password,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        console.log(res.statusCode)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '登录成功',
            duration: 2000
          })
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('id', res.data.id)
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 500)
        } else if (res.statusCode == 401) {
          wx.showModal({
            content: '用户名不存在或密码错误',
            showCancel: false,
            success(res) {
              console.log(res.confirm)
            }
          })
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: '服务器错误',
            icon: 'error'
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  },

  forget() {
    wx.navigateTo({
      url: '/pages/forget/forget',
    })
  },

  register() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }
})