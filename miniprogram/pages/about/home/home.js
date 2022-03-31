const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    avatar: '',
    nickname: '',
    recordsCount: 0,
    wordsCount: 0,
    visitTotal: 0
  },

  lifetimes: {
    attached() {
      var that = this
      app.watch(function (value) {
        if (value.avatar) {
          that.setData({
            avatar: value.avatar
          })
        }
        if (value.nickname) {
          that.setData({
            nickname: value.nickname
          })
        }
      })
      this.getInfo()
      let i = 0
      numDH();

      function numDH() {
        if (i < 20) {
          setTimeout(function () {
            that.setData({
              recordsCount: i,
              wordsCount: i,
              visitTotal: i
            })
            i++
            numDH()
          }, 20)
        } else {
          that.setData({
            recordsCount: that.coutNum(app.globalData.contribution.pronunciation),
            wordsCount: that.coutNum(app.globalData.contribution.word),
            visitTotal: that.coutNum(app.globalData.contribution.listened)
          })
        }
      }
    },
  },

  methods: {
    // 获取用户信息
    getInfo() {
      wx.showLoading()
      let that = this
      wx.request({
        url: app.globalData.server + 'users/' + app.globalData.id,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.statusCode == 200) {
            app.globalData.userInfo = res.data.user,
              app.globalData.publish_articles = res.data.publish_articles,
              app.globalData.publish_comments = res.data.publish_comments,
              app.globalData.like_articles = res.data.like_articles,
              app.globalData.contribution = res.data.contribution
            that.setData({
              avatar: app.globalData.userInfo.avatar,
              nickname: app.globalData.userInfo.nickname
            })
            wx.hideLoading()
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

    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },

    //进入个人信息页面
    userInfo() {
      wx.navigateTo({
        url: '/pages/about/userinfo/userinfo',
      })
    },

    getMyRecords() {
      let id = app.globalData.id
      wx.navigateTo({
        url: '/pages/component/voice/voice?id=' + id,
      })
    },

    // 退出登录
    exit() {
      wx.showModal({
        content: '是否退出当前登录？',
        success(res) {
          if (res.confirm) {
            wx.clearStorageSync()
            app.globalData.status = 0
            wx.navigateTo({
              url: '/pages/index/index?status=basics',
              success(res) {
                wx.showToast({
                  title: '登出成功！',
                })
              }
            })
          }
        }
      })
    },

    //绑定微信
    bindingWechat() {
      if (app.globalData.userInfo.wechat === true) {
        wx.showModal({
          content: '当前用户已经绑定微信！',
          showCancel: false
        })
      } else {
        wx.showModal({
          content: '是否绑定微信？',
          success(res) {
            if (res.confirm) {
              wx.login({
                success(res1) {
                  if (res1.code) {
                    wx.request({
                      url: app.globalData.server + 'users/' + app.globalData.id + '/wechat',
                      method: 'PUT',
                      data: {
                        jscode: res1.code
                      },
                      header: {
                        'content-type': 'application/json',
                        'token': app.globalData.token
                      },
                      success(res2) {
                        if (res2.statusCode == 200) {
                          wx.showToast({
                            title: '绑定成功',
                          })
                        } else if (res2.statusCode == 401) {
                          wx.showModal({
                            content: '没有权限',
                          })
                        } else if (res2.statusCode == 500) {
                          wx.showToast({
                            title: '服务器错误',
                            icon: 'error'
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    }
  }
})