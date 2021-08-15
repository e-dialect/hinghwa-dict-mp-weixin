const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    status: 0,
    word: {},
    swiperList: [{
      id: 0,
      url: 'https://wx4.sinaimg.cn/mw690/0084vph8ly1gsvkzupsv7j319j0sg7jn.jpg'
    }, {
      id: 1,
      url: 'https://wx4.sinaimg.cn/mw690/0084vph8ly1gsvkzv3gtqj30xk0kz0v2.jpg',
    }, {
      id: 2,
      url: 'https://wx4.sinaimg.cn/mw690/0084vph8ly1gsvkzu0pn3j62180tgalh02.jpg'
    }, {
      id: 3,
      url: 'https://wx1.sinaimg.cn/mw690/0084vph8ly1gsvkzvksqnj314o0mvjv7.jpg'
    }]
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        status: app.globalData.status,
        word: app.globalData.word
      })
      if (this.data.status == 0) {
        app.globalData.token = wx.getStorageSync('token')
        app.globalData.id = wx.getStorageSync('id')
        // 该用户已经注册登录
        if (app.globalData.token.length != 0) {
          app.globalData.status = 1
          this.setData({
            status: 1
          })
          wx.request({
            // url: app.globalData.server + 'users/' + app.globalData.id,
            url: 'http://127.0.0.1:4523/mock/404238/users/1',
            method: 'GET',
            data: {},
            header: {
              'content-type': 'application/json', // 默认值
            },
            success(res) {
              console.log(res)
              if (res.statusCode == 200) {
                app.globalData.userInfo = res.data.user
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
      this.getWordId();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  methods: {
    getWordId() {
      if (!this.data.word.id) {
        var that = this
        wx.request({
          // url: app.globalData.server + "website/word_of_the_day",
          url: 'http://127.0.0.1:4523/mock/404238/website/word_of_the_day',
          method: 'GET',
          data: {},
          header: {
            'content-type': 'application/json',
          },
          success(res) {
            if (res.statusCode == 200)
            {
              app.globalData.word.id = res.data.word_of_the_day
              that.setData({
                word: {id: res.data.word_of_the_day}
              })
              // 获取每日一词
              that.getWord();
            } else {
              wx.showToast({
                title: '服务器错误'
              })
            }
          }
        })
      }
    },
    getWord() {
      let that = this
      wx.request({
        // url: app.globalData.server + 'words/' + app.globalData.word.id,
        url: 'http://127.0.0.1:4523/mock/404238/words/1',
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          console.log(res.data)
          if (res.statusCode == 200)
          {
            app.globalData.word = res.data.word
            that.setData({
              word: res.data.word
            })
          } else {
            wx.showToast({
              title: '服务器错误',
              icon: 'error'
            })
          }
        }
      })
    },
    login(e) {
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res.userInfo.avatarUrl)
          app.globalData.userInfo.avatar = res.userInfo.avatarUrl
          app.globalData.userInfo.nickname = res.userInfo.nickName
          // 跳转到登录页面
          wx.navigateTo({
            url: '/pages/login/login',
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    },
    getMore() {
      let word = JSON.stringify(this.data.word)
      wx.navigateTo({
        url: '/pages/basics/word/word?word=' + word
      })
    },
    search() {
      wx.navigateTo({
        url: '/pages/basics/search/search',
      })
    }
  }
})