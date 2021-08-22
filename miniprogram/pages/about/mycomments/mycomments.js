const app = getApp()

Page({
  data: {
    publish_comments: []
  },

  onLoad() {
    // 获取我的评论
    getComments()
  },

  getComments() {
    let that = this
    wx.request({
      url: app.globalData.server,
    })
  }
})