const app = getApp()

Page({
  data: {
    avatar: '',
    nickname: '',
    email: '',
    phone: '',
    date: '未知',
    region: ['', '未知'],
  },
  onLoad() {
    if (app.globalData.userInfo.birthday) {
      this.setData({
        date: app.globalData.userInfo.birthday
      })
    }
    if (app.globalData.userInfo.county) {
      this.setData({
        region: ['', app.globalData.userInfo.county, app.globalData.userInfo.town]
      })
    }
  },
  onShow() {
    this.setData({
      avatar: app.globalData.userInfo.avatar,
      nickname: app.globalData.userInfo.nickname,
      email: app.globalData.userInfo.email,
      phone: app.globalData.userInfo.telephone,
    })
  },
  chooseAvatar() {
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success(res) {
        const tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.globalData.server + 'website/files',
          filePath: tempFilePaths,
          name: 'file',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            if (res.statusCode == 200) {
              let url = JSON.parse(res.data).url
              app.globalData.data = {
                'avatar': url
              }
              that.setData({
                avatar: url
              })
              that.changeAvatar(url)
            }
          }
        })
      }
    })
  },

  changeAvatar(url) {
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
  },

  changeNickname() {
    wx.navigateTo({
      url: '/pages/about/nickname/nickname',
    })
  },

  changeEmail() {
    wx.navigateTo({
      url: '/pages/about/email/email',
    })
  },

  changePhone() {
    wx.navigateTo({
      url: '/pages/about/phone/phone',
    })
  },

  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
    app.globalData.userInfo.birthday = e.detail.value
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
        console.log(res.data)
        if (res.statusCode == 200) {
          wx.setStorage({
            data: res.data.token,
            key: 'token',
          })
          wx.showToast({
            title: '修改成功',
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
  },

  RegionChange(e) {
    var region = e.detail.value
    this.setData({
      region: region
    })
    app.globalData.userInfo.county = region[1]
    app.globalData.userInfo.town = region[2]
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
        console.log(res.data)
        if (res.statusCode == 200) {
          wx.setStorage({
            data: res.data.token,
            key: 'token',
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
})