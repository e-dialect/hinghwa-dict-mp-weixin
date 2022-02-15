const app = getApp()
const server = app.globalData.server

Page({
  data: {
    PageCur: 'basics',
    PageStatus: 0
  },

  onLoad(options) {
    if (options.status) {
      this.setData({
        PageCur: options.status
      })
    }
  },

  NavChange(e) {
    let PageCur = e.currentTarget.dataset.cur
    if (app.globalData.status == 0 && PageCur == 'about') {
      let that = this
      wx.showModal({
        content: '请先授权登录',
        showCancel: false,
        success(res) {
          that.setData({
            PageCur: 'basics'
          })
        }
      })
      return;
    } else {
      this.setData({
        PageCur: PageCur
      })
    }
  },
})