const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    pageData: [],
    pageNum: 0,
    itemNum: 0,
    curPage: 1,
    keyword: "",
    keywordTmp: ""
  },

  onLoad() {
    let keyword = ""
    let page = 1
    this.getPageData(keyword, page)
  },

  getPageData(keyword, page) {
    wx.showLoading()
    let that = this
    wx.request({
      url: app.globalData.server + 'website/daily-expression?keyword=' + keyword + '&pageSize=10&page=' + page,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          that.setData({
            pageData: res.data.results,
            pageNum: res.data.total.page,
            itemNum: res.data.total.item
          })
        } else {
          wx.showToast({
            title: '服务器错误',
          })
        }
      }
    })
  },

  getInput(e) {
    this.setData({
      keywordTmp: e.detail.value
    })
  },

  search() {
    let keywordTmp = this.data.keywordTmp
    if (keywordTmp == "") {
      wx.showToast({
        title: "搜索内容为空！",
        icon: 'none'
      })
    } else {
      this.setData({
        keyword: keywordTmp,
        curPage: 1
      })
      this.getPageData(this.data.keyword, 1)
    }
  },

  previous() {
    let curPage = this.data.curPage
    if (curPage == 1) {
      wx.showToast({
        title: "当前页为第一页！",
        icon: 'none'
      })
    } else {
      this.setData({
        curPage: curPage - 1
      })
      this.getPageData(this.data.keyword, curPage - 1)
    }
  },

  next() {
    let curPage = this.data.curPage
    if (curPage >= this.data.pageNum) {
      wx.showToast({
        title: "当前页为末尾页！",
        icon: 'none'
      })
    } else {
      this.setData({
        curPage: curPage + 1
      })
      this.getPageData(this.data.keyword, curPage + 1)
    }
  },
})