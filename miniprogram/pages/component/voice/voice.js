const app = getApp()

Page({
  data: {
    pronunciation: []
  },

  onLoad() {
    this.getPronunciation()
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext()
  },

  // 获取字词发音
  getPronunciation() {
    let that = this
    wx.request({
      url: app.globalData.server + 'pronunciation',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          pronunciation: res.data.pronunciation
        })
      }
    })
  },

  play(e) {
    let index = e.currentTarget.dataset.index
    this.innerAudioContext.src = this.data.pronunciation[index].pronunciation.source
    this.innerAudioContext.play()
  },

  uploadPronunciation() {
    // wx.navigateTo({
    //   url: '/pages/component/uploadpronunciation/uploadpronunciation'
    // })
  },
})