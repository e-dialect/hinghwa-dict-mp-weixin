const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    status: 0,
    word: {},
    announcements: []
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        status: app.globalData.status,
        word: app.globalData.word
      })
      this.getWord()
      this.getArticles()
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
            url: app.globalData.server + 'users/' + app.globalData.id,
            method: 'GET',
            data: {},
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              console.log(res.data)
              if (res.statusCode == 200) {
                app.globalData.userInfo = res.data.user,
                  app.globalData.publish_articles = res.data.publish_articles,
                  app.globalData.publish_comments = res.data.publish_comments,
                  app.globalData.like_articles = res.data.like_articles,
                  app.globalData.contribution = res.data.contribution
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
    },

    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  methods: {
    getWord() {
      if (!this.data.word.id) {
        var that = this
        wx.request({
          url: app.globalData.server + "website/word_of_the_day",
          method: 'GET',
          data: {},
          header: {
            'content-type': 'application/json',
          },
          success(res) {
            if (res.statusCode == 200) {
              that.getWordDetails(res.data.word_of_the_day.id)
            } else {
              wx.showToast({
                title: '服务器错误'
              })
            }
          }
        })
      }
    },

    getArticles() {
      let that = this
      wx.request({
        url: app.globalData.server + 'website/announcements',
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.statusCode == 200) {
            that.setData({
              announcements: res.data.announcements
            })
          }
        }
      })
    },

    getWordDetails(id) {
      let that = this
      wx.request({
        url: app.globalData.server + 'words/' + id,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.statusCode == 200) {
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
        desc: '展示用户信息',
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

    toArticle(e) {
      let index = e.currentTarget.dataset.index
      let id = this.data.announcements[index].article.id
      wx.navigateTo({
        url: '/pages/plugin/article/article?id=' + id
      })
    },

    search() {
      wx.navigateTo({
        url: '/pages/basics/search/search',
      })
    }
  }
})