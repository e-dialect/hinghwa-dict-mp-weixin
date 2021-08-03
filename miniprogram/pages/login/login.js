const app = getApp()

Page({
  data: {
    avatar: '',
    is_close: true,
    ear: 'close.png'
  },
  onLoad() {
    this.setData({
      avatar: app.globalData.userInfo.avatar
    })
  },
  bindEar() {
    if (this.data.is_close == true) {
      this.setData({
        is_close: false,
        ear: 'open.png'
      })
    } else {
      this.setData({
        is_close: true,
        ear: 'close.png'
      })
    }
  },
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
      // url: app.globalData.server + 'login',
      url: 'http://127.0.0.1:4523/mock/404238/login',
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
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else if (res.statusCode == 401) {
          wx.showModal({
            title: '提示',
            content: '用户不存在或密码错误',
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
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  },
  register() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }
})