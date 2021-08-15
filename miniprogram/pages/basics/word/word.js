const app = getApp()

Page({
  data: {
    word: {},
    date: '',
    contributor: '',
    related_words: [],
    related_articles: []
  },

  onLoad(options) {
    this.setData({
      word: JSON.parse(options.word)
    })
    // 获取日期
    this.getDate()
    // 获取贡献人
    this.getContributor()
    // 获取相关词语
    this.getRelatedWords()
    // 获取相关文章
    this.getAriticles()
  },

  getDate() {
    var timestamp = Date.parse(new Date())
    var date = new Date(timestamp)
    var Y = date.getFullYear()
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var date = Y + '-' + M + '-' + D
    this.setData({
      date: date
    })
  },

  getContributor() {
    let that = this
    wx.request({
      // url: app.globalData.server + 'users/' + that.data.word.contributor,
      url: 'http://127.0.0.1:4523/mock/404238/users/1',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            contributor: res.data.user.username
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

  getRelatedWords() {
    let that = this
    wx.request({
      // url: app.globalData.server + 'words',
      url: 'http://127.0.0.1:4523/mock/404238/words',
      method: 'PUT',
      data: {
        words: that.data.word.related_words
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          that.setData({
            related_words: res.data.words
          })
          console.log(that.data.related_words)
        }
      }
    })
  },

  getAriticles() {
    let that = this
    wx.request({
      // url: app.globalData.server + 'articles',
      url: 'http://127.0.0.1:4523/mock/404238/articles',
      method: 'PUT',
      data: {
        articles: that.data.word.related_articles
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          that.setData({
            related_articles: res.data.articles
          })
          console.log(that.data.related_articles)
        }
      }
    })
  },

  getMore(e) {
    let index = e.currentTarget.dataset.id
    let word = JSON.stringify(this.data.related_words[index])
    wx.navigateTo({
      url: '/pages/basics/word/word?word=' + word
    })
  },

  back() {
    wx.navigateBack({
      delta: 1
    })
  }
})