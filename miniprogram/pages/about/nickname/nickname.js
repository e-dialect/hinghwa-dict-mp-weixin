const app = getApp()

Page({
  data: {
    nickname: ''
  },
  setNickname(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  saveNickname() {
    var nickname = this.data.nickname
    if (nickname == '') {
      wx.showModal({
        content: '请输入正确的昵称',
        showCancel: false,
        success(res) {
          console.log(res.confirm)
        }
      })
    } else {
      app.globalData.userInfo.nickname = nickname
      wx.request({
        url: app.globalData.server + 'users/' + app.globalData.id,
        method: 'PUT',
        data: {
          user: app.globalData.userInfo
        },
        header: {
          'content-type': 'application/json',
          'token': app.globalData.token
        },
        success(res) {
          if (res.statusCode == 200) {
            wx.setStorage({
              data: res.data.token,
              key: 'token',
            })
            wx.showToast({
              title: '修改成功',
            })
            app.globalData.data = {
              'nickname': nickname
            }
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          } else if (res.statusCode == 400) {
            wx.showToast({
              title: '格式错误',
            })
          } else if (res.statusCode == 409) {
            wx.showToast({
              title: '昵称重复',
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