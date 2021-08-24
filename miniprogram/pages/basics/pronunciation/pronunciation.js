const app = getApp()

Page({
  data: {
    id: 0,
    word: '',
    pronunciation: []
  },

  onLoad(options) {
    this.setData({
      id: options.id,
      word: options.word
    })
    this.getPronunciation()
  },

  // 获取字词发音
  getPronunciation() {
    let id = this.data.id
    let that = this
    wx.request({
      url: app.globalData.server + 'pronunciation?word=' + id,
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

  uploadPronunciation() {
    let id = this.data.id,
      word = this.data.word
    wx.navigateTo({
      url: '/pages/component/uploadpronunciation/uploadpronunciation?id=' + id + '&word=' + word
    })
  },

  play(e) {
    let index = e.currentTarget.dataset.index
    var src = this.data.pronunciation[index].pronunciation.source
    if (src == '') {
      wx.showToast({
        title: '音源为空！',
        icon: 'error'
      })
      return;
    }
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.src = src
    this.innerAudioContext.play()
  }
})