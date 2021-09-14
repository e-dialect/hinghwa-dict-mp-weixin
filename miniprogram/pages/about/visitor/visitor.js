const app = getApp()

Page({
  data: {
    user: {},
    publish_articles: [],
    publish_comments: [],
    like_articles: [],
    contribution: {}
  },

  onLoad(options) {
    let id = options.id
    this.getInfo(id)
  },

  // 获取用户信息
  getInfo(id) {
    let that = this
    wx.request({
      url: app.globalData.server + 'users/' + id,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            user: res.data.user,
            publish_articles: res.data.publish_articles,
            publish_comments: res.data.publish_comments,
            like_articles: res.data.like_articles,
            contribution: res.data.contribution
          })
        }
      }
    })
  },

  // 返回上一页面
  back() {
    wx.navigateBack({
      delta: 1
    })
  }
})