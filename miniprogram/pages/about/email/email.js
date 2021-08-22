const app = getApp()

Page({
  data: {
    old_email: '',
    code: '',
    new_email: ''
  },
  onLoad() {
    this.setData({
      old_email: app.globalData.userInfo.email
    })
  },
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode() {
    var that = this
    wx.request({
      url: app.globalData.server + 'website/email',
      method: 'POST',
      data: {
        email: that.data.new_email
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
  getNewEmail(e) {
    this.setData({
      new_email: e.detail.value
    })
  },
  setNewEmail() {
    var code = this.data.code
    var new_email = this.data.new_email
    app.globalData.userInfo.email = new_email
    wx.request({
      url: app.globalData.server + 'users/' + app.globalData.id + '/email',
      // url: 'http://127.0.0.1:4523/mock/404238/users/1/email',
      method: 'PUT',
      data: {
        code: code,
        email: new_email
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success(res) {
        if (res.statusCode == 200) {
          app.globalData.userInfo.email = new_email
          wx.showToast({
            title: '修改成功',
          })
          // 返回上一页面
          wx.navigateBack({
            delta: 1
          })
        } else if (res.statusCode == 401) {
          wx.showToast({
            title: '没有权限',
          })
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: '服务器错误',
          })
        }
      }
    })
  }
})