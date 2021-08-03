const app = getApp()

Page({
  data: {
    phone: ''
  },
  setPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  savePhone() {
    var phone = this.data.phone
    if (phone.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确格式的手机号码',
        showCancel: false,
        success(res) {
          console.log(res.confirm)
        }
      })
    } else {
      wx.request({
        // url: app.globalData.server + 'users/' + app.globalData.id,
        url: 'http://127.0.0.1:4523/mock/404238/users/1',
        method: 'PUT',
        data: {
          user: app.globalData.userInfo
        },
        header: {
          'content-type': 'application/json',
          'token': app.globalData.token
        },
        success(res) {
          console.log(res.data)
          if (res.statusCode == 200) {
            app.globalData.userInfo.phone = phone
            wx.setStorage({
              data: res.data.token,
              key: 'token',
            })
            wx.showToast({
              title: '修改成功',
            })
            // 返回上一页面
            wx.navigateBack({
              delta: 1
            })
          } else if (res.statusCode == 400) {
            wx.showToast({
              title: '格式错误',
            })
          } else if (res.statusCode == 409) {
            wx.showToast({
              title: '用户名重复',
            })
          } else {
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
  }
})