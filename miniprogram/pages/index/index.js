const app = getApp()
const server = app.globalData.server

Page({
  data: {
    PageCur: 'basics',
    PageStatus: 0
  },

  onLoad(options) {
    if (options.status) {
      this.setData({
        PageCur: options.status
      })
    }
  },

  NavChange(e) {
    let PageCur = e.currentTarget.dataset.cur
    if (app.globalData.status == 0 && PageCur == 'about') {
      let that = this
      wx.showModal({
        content: '请先授权登录',
        showCancel: false,
        success(res) {
          that.login()
          // that.setData({
          //   PageCur: 'basics'
          // })
        }
      })
      return;
    } else {
      this.setData({
        PageCur: PageCur
      })
    }
  },

  login() {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        wx.login({
          success(res1) {
            if (res1.code) {
              //发起网络请求
              wx.request({
                url: app.globalData.server + 'login/wechat',
                method: 'POST',
                data: {
                  jscode: res1.code
                },
                header: {
                  'content-type': 'application/json'
                },
                success(res2) {
                  console.log(res2)
                  if (res2.statusCode == 200) {
                    wx.showToast({
                      title: '登录成功',
                      duration: 2000
                    })
                    wx.setStorageSync('token', res2.data.token)
                    wx.setStorageSync('id', res2.data.id)
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    }, 500)
                  } else if (res2.statusCode == 404) {
                    wx.showModal({
                      content: '当前用户未注册或未绑定微信',
                      showCancel: false,
                      success(res3) {
                        if (res3.confirm) {
                          //跳转到登录页面
                          wx.navigateTo({
                            url: '/pages/login/login',
                          })
                        }
                      }
                    })
                  } else if (res2.statusCode == 500) {
                    wx.showToast({
                      title: '服务器错误',
                      icon: 'error'
                    })
                  }
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      fail(err) {
        //跳转到登录页面
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
  }
})