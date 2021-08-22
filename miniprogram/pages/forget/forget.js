const app = getApp()

Page({
  data: {
    username: '',
    email: '',
    status: 0,
    is_pwd: true
  },

  getUsername(e) {
    this.setData({
      username: e.detail.value
    })
  },

  next() {
    let username = this.data.username
    let that = this
    wx.request({
      url: app.globalData.server + 'login/forget?username=' + username,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            email: res.data.email,
            status: 1
          })
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: '服务器错误',
            icon: 'error'
          })
        }
      }
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

  ear() {
    if (this.data.is_pwd == true) {
      this.setData({
        is_pwd: false
      })
    } else {
      this.setData({
        is_pwd: true
      })
    }
  },

  reset(e) {
    let username = this.data.username
    let email = this.data.email
    let code = e.detail.value.code
    let password = e.detail.value.password
    wx.request({
      url: app.globalData.server + 'login/forget',
      method: 'PUT',
      data: {
        username: username,
        email: email,
        code: code,
        password: password
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '重置成功',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 500)
        } else if (res.statusCode == 401) {
          wx.showToast({
            title: '验证码错误',
            icon: 'error'
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'error'
          })
        }
      }
    })
  }
})