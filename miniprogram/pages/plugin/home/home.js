const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    hot_articles: [],
    all_articles: [],
    display_all_articles: [],
    page: 1,
    status: 0,
    triggered: false
  },

  lifetimes: {
    attached() {
      let that = this
      this.getHotArticles()
    }
  },

  methods: {
    // 获取热门文章
    getHotArticles() {
      wx.showLoading()
      let that = this
      wx.request({
        url: app.globalData.server + 'website/hot_articles',
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            that.setData({
              hot_articles: res.data.hot_articles
            })
            that.getAllArticles()
          }
        }
      })
    },

    // 获取全部文章
    getAllArticles() {
      let that = this
      wx.request({
        url: app.globalData.server + 'articles',
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.statusCode == 200) {
            // 获取文章id数组
            let arr = res.data.articles
            // 获取文章数组
            wx.request({
              url: app.globalData.server + 'articles',
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
                    all_articles: res.data.articles,
                    display_all_articles: res.data.articles.slice(0, 4)
                  })
                  wx.hideLoading()
                }
              }
            })
          }
        }
      })
    },

    // 下拉刷新
    onRefresh() {
      if (this._freshing) return
      this._freshing = true
      this.getHotArticles()
      setTimeout(() => {
        this.setData({
          triggered: false,
        })
        this._freshing = false
      }, 500)
    },

    // 加载更多文章
    loadMoreArticles() {
      wx.showLoading()
      let page = this.data.page
      let origin_articles = this.data.display_all_articles
      let concat_articles = this.data.all_articles.slice(page * 4, page * 4 + 4)
      this.setData({
        page: page + 1,
        display_all_articles: origin_articles.concat(concat_articles)
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    },

    changeStatus(e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        status: index
      })
    },

    article(e) {
      let index = e.currentTarget.dataset.index
      let id = 0
      if (this.data.status == 0) {
        id = this.data.hot_articles[index].article.id
      } else {
        id = this.data.all_articles[index].article.id
      }
      wx.navigateTo({
        url: '/pages/plugin/article/article?id=' + id
      })
    },

    writeArticle() {
      wx.navigateTo({
        url: '/pages/plugin/write/write',
      })
    }
  }
})