const app = getApp()

Page({
  data: {
    article: {},
    is_like: 0,
    likes: 0,
    comments: [],
    map: [],
    parent: 0,
    comment: '',
    is_reply: false,
    ph_text: '评论...',
  },

  onLoad(options) {
    let data = JSON.parse(options.article)
    this.setData({
      article: data,
      likes: data.article.likes
    })
  },

  onShow() {
    // 获取评论
    this.getComments()
  },

  getComments() {
    let id = (this.data.article.article.id).toString()
    let that = this
    wx.request({
      // url: app.globalData.server + 'articles/' + id + '/comments',
      url: 'http://127.0.0.1:4523/mock/404238/articles/1/comments',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          let comments = res.data.comments
          let map = []
          // 获取根评论
          for (let i = 0; i < comments.length; i++) {
            comments[i].kids = []
            map[comments[i].id] = i
          }
          // 获取子孙评论
          for (let i = 0; i < comments.length; i++) {
            if (comments[i].parent != 0) {
              let p = comments[i].parent
              while (comments[map[p]].parent) {
                p = comments[map[p]].parent
              }
              comments[map[p]].kids.push(comments[i])
            }
          }
          that.setData({
            comments: comments,
            map: map
          })
        }
      }
    })
  },

  getAllReplys(e) {
    let id = e.currentTarget.dataset.id
    let comment = JSON.stringify(this.data.comments[this.data.map[id]])
    let article_id = this.data.article.article.id
    wx.navigateTo({
      url: '/pages/plugin/comment/comment?comment=' + comment + '&id=' + article_id
    })
  },

  reply(e) {
    let id = e.currentTarget.dataset.id
    let reply_user = this.data.comments[this.data.map[id]].user.nickname
    this.setData({
      parent: id,
      is_reply: true,
      ph_text: '@ ' + reply_user
    })
  },

  getText(e) {
    this.setData({
      comment: e.detail.value
    })
  },

  comment() {
    let comment = this.data.comment
    let parent = this.data.parent
    let id = (this.data.article.article.id).toString()
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
          that.getComments()
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
  },

  focus() {
    this.setData({
      is_reply: true
    })
  },

  blur() {
    this.setData({
      parent: 0,
      is_reply: false,
      ph_text: '评论...'
    })
  },

  like() {
    let is_like = this.data.is_like
    let that = this
    if (is_like == 0) {
      // 给文章点赞
      wx.request({
        // url: app.globalData.server + 'articles/' + that.data.article.article.id + '/like',
        url: 'http://127.0.0.1:4523/mock/404238/articles/1/like',
        method: 'POST',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.statusCode == 200) {
            that.setData({
              likes: that.data.likes + 1,
              is_like: 1
            })
          }
        }
      })
    } else {
      // 取消点赞
      wx.request({
        // url: app.globalData.server + 'articles/' + that.data.article.article.id + '/like',
        url: 'http://127.0.0.1:4523/mock/404238/articles/1/like',
        method: 'delete',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.statusCode == 200) {
            that.setData({
              likes: that.data.likes - 1,
              is_like: 0
            })
          }
        }
      })
    }
  }
})