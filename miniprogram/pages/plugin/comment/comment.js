const app = getApp()

Page({
  data: {
    article_id: 0,
    comment: {},
    map: [],
    ph_text: '评论...',
    is_reply: false,
    text: ''
  },

  onLoad(options) {
    this.setData({
      article_id: options.id,
      comment: JSON.parse(options.comment)
    })
    let map = []
    for (let i = 0; i < this.data.comment.kids.length; i++) {
      map[this.data.comment.kids[i].id] = i
    }
    this.setData({
      map: map
    })
  },

  focus() {
    this.setData({
      is_reply: true
    })
  },

  blur() {
    let id = this.data.comment.id
    this.setData({
      parent: id,
      is_reply: false,
      ph_text: '评论...'
    })
  },

  reply(e) {
    let id = e.currentTarget.dataset.id
    let reply_user = this.data.comment.kids[this.data.map[id]].user.nickname
    this.setData({
      parent: id,
      is_reply: true,
      ph_text: '@ ' + reply_user
    })
  },

  getText(e) {
    this.setData({
      text: e.detail.value
    })
  },

  comment() {
    let comment = this.data.text
    let parent = this.data.parent
    let id = this.data.article_id
    let that = this
    wx.request({
      // url: app.globalData.server + 'articles/' + id + '/comments',
      url: 'http://127.0.0.1:4523/mock/404238/articles/1/comments',
      method: 'POST',
      data: {
        content: comment,
        parent: parent
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '发表成功',
          })
          wx.navigateBack({
            delta: 1,
          })
        } else if (res.statusCode == 400) {
          wx.showToast({
            title: '格式错误',
            icon: 'error'
          })
        } else if (res.statusCode == 401) {
          wx.showToast({
            title: '没有权限',
            icon: 'error'
          })
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: '服务器错误',
            icon: 'error'
          })
        }
      }
    })
  }
})