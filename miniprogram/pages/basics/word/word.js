const app = getApp()

Page({
  data: {
    word: {},
    date: '',
    related_words: [],
    related_articles: []
  },

  onLoad(options) {
    this.setData({
      word: JSON.parse(options.word)
    })
    // 获取日期
    this.getDate()
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

  toVisitor() {
    let id = this.data.word.contributor.id
    wx.navigateTo({
      url: '/pages/about/visitor/visitor?id=' + id,
    })
  },

  getRelatedWords() {
    wx.showLoading()
    let that = this
    wx.request({
      url: app.globalData.server + 'words',
      method: 'PUT',
      data: {
        words: that.data.word.related_words
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            related_words: res.data.words
          })
          wx.hideLoading()
        }
      }
    })
  },

  getAriticles() {
    wx.showLoading()
    let that = this
    wx.request({
      url: app.globalData.server + 'articles',
      method: 'PUT',
      data: {
        articles: that.data.word.related_articles
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            related_articles: res.data.articles
          })
          wx.hideLoading()
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