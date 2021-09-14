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
    if (app.globalData.status == 0) {
      wx.showModal({
        content: '请先授权登录',
        showCancel: false,
        success(res) {
          console.log(res.confirm)
        }
      })
      return;
    } else {
      this.setData({
        PageCur: e.currentTarget.dataset.cur
      })
    }
  },
})