const app = getApp()

Page({
  data: {
    status: 0,
    history: [],
    key: '',
    characters: [],
    words: [],
    articles: []
  },

  onLoad() {
    var history = wx.getStorageSync('history')
    if (history) {
      this.setData({
        history: history
      })
    }
  },

  key(e) {
    this.setData({
      key: e.detail.value
    })
  },

  search() {
    if (this.data.key == '') {
      wx.showModal({
        title: '警告',
        content: '搜索内容为空！',
        showCancel: false,
        success(res) {
          console.log(res.confirm)
        }
      })
      return;
    }
    if (this.data.status == 0) {
      this.setData({
        status: 1
      })
    }
    this.data.history.push(this.data.key)
    wx.setStorageSync('history', this.data.history)
    // 获取单字
    this.getCharacters()
    // 获取词语
    this.getWords()
    // 获取文章
    this.getArticles()
  },

  getCharacters() {
    var that = this
    wx.request({
      // url: app.globalData.server + 'characters?search=' + that.data.key,
      url: 'http://127.0.0.1:4523/mock/404238/characters',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.statusCode == 200) {
          var arr = res.data.characters
          wx.request({
            // url: app.globalData.server + 'characters'
            url: 'http://127.0.0.1:4523/mock/404238/characters',
            method: 'PUT',
            data: {
              characters: arr
            },
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              if (res.statusCode == 200) {
                that.setData({
                  characters: res.data.characters
                })
              }
            }
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

  getWords() {
    var that = this
    wx.request({
      // url: app.globalData.server + 'words?search=' + that.data.key,
      url: 'http://127.0.0.1:4523/mock/404238/words',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.statusCode == 200) {
          var arr = res.data.words
          wx.request({
            // url: app.globalData.server + 'words'
            url: 'http://127.0.0.1:4523/mock/404238/words',
            method: 'PUT',
            data: {
              words: arr
            },
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              if (res.statusCode == 200) {
                that.setData({
                  words: res.data.words
                })
              }
            }
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

  getArticles() {
    var that = this
    wx.request({
      // url: app.globalData.server + 'articles?search=' + that.data.key,
      url: 'http://127.0.0.1:4523/mock/404238/articles',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.statusCode == 200) {
          var arr = res.data.articles
          wx.request({
            // url: app.globalData.server + 'articles' 
            url: 'http://127.0.0.1:4523/mock/404238/articles',
            method: 'PUT',
            data: {
              articles: arr
            },
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              if (res.statusCode == 200) {
                that.setData({
                  articles: res.data.articles
                })
              }
            }
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

  deleteHistory() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否清空历史记录？',
      success(res) {
        wx.setStorageSync('history', null)
        that.setData({
          history: []
        })
      }
    })
  },

  sort(e) {
    this.setData({
      status: e.target.dataset.index
    })
  },

  character(e) {
    let index = e.currentTarget.dataset.index
    let character = JSON.stringify(this.data.characters[index])
    wx.navigateTo({
      url: '/pages/basics/characters/characters?character=' + character
    })
  },

  word(e) {
    let index = e.currentTarget.dataset.index
    let word = JSON.stringify(this.data.words[index])
    wx.navigateTo({
      url: '/pages/basics/words/words?word=' + word
    })
  }
})