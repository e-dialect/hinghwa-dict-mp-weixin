const app = getApp()

Page({
  data: {
    id: 0,
    word: {},
    pronunciation: []
  },

  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.getWord()
  },

  getWord() {
    let that = this
    wx.request({
      url: app.globalData.server + 'words/' + that.data.id,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            word: res.data.word
          })
          that.getPronunciation()
        }
      }
    })
  },

  // 获取发音
  getPronunciation() {
    let that = this
    wx.request({
      url: app.globalData.server + 'pronunciation?word=' + that.data.id,
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

  pronounce() {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onError((res) => {
      that.tip("播放语音失败！")
    })
    var src = this.data.pronunciation[0].pronunciation.source
    this.innerAudioContext.src = src
    this.innerAudioContext.play()
  },

  morePronunciation() {
    let id = this.data.word.id
    let word = this.data.word.word
    wx.navigateTo({
      url: '/pages/basics/pronunciation/pronunciation?id=' + id + '&word=' + word,
    })
  }
})