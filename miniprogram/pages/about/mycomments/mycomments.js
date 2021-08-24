const app = getApp()

Page({
  data: {
    avatar: '',
    nickname: '',
    publish_comments: []
  },

  onLoad() {
    this.setData({
      avatar: app.globalData.userInfo.avatar,
      nickname: app.globalData.userInfo.nickname
    })
    // 获取我的评论
    this.getComments()
  },

  getComments() {
    let that = this
    wx.request({
      url: app.globalData.server + 'articles/comments',
      method: 'PUT',
      data: {
        comments: app.globalData.publish_comments
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          that.setData({
            publish_comments: res.data.comments
          })
        }
      }
    })
  },

  toArticle(e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.publish_comments[index].article
    wx.navigateTo({
      url: '/pages/plugin/article/article?id=' + id
    })
  }
})