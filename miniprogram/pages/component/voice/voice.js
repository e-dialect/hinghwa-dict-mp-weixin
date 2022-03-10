const app = getApp()

Page({
  data: {
    id: -1,
    pronunciation: []
  },

  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.getPronunciation()
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext()
  },

  // 获取字词发音
  getPronunciation() {
    let that = this
    wx.request({
      url: app.globalData.server + 'pronunciation?contributor=' + that.data.id,
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

  toVisitor(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/about/visitor/visitor?id=' + id,
    })
  }
})