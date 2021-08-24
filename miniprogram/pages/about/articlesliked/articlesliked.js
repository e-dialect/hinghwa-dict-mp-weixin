const app = getApp()

Page({
  data: {
    like_articles: []
  },

  onLoad() {
    this.getArticles()
  },

  getArticles() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    // 获取点赞文章
    wx.request({
      url: app.globalData.server + 'articles',
      method: 'PUT',
      data: {
        articles: app.globalData.like_articles
      },
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            like_articles: res.data.articles
          })
          wx.hideLoading()
        }
      }
    })
  },

  // 进入文章
  article(e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.like_articles[index].article.id
    wx.navigateTo({
      url: '/pages/plugin/article/article?id=' + id
    })
  },
})