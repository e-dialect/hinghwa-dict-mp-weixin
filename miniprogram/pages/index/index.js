const app = getApp()
const server = app.globalData.server

Page({
  data: {
    PageCur: 'basics',
    PageStatus: 0
  },
  NavChange(e) {
    // if (app.globalData.status == 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先授权登录',
    //     showCancel: false,
    //     success(res) {
    //       console.log(res.confirm)
    //     }
    //   })
    // } else {
    //   this.setData({
    //     PageCur: e.currentTarget.dataset.cur
    //   })
    // }
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})