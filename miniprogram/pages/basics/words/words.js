const app = getApp()

Page({
  data: {
    id: 0,
    word: {},
    pronunciation: [],
    TabCur: 0,
    tabs: ['释义', '发音', '附注'],
    platform: ''
  },

  onLoad(options) {
    this.setData({
      id: options.id,
      platform: app.globalData.platform
    })
    this.getWord()
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onError((res) => {
      that.tip("播放语音失败！")
    })
  },

  toVisitor(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/about/visitor/visitor?id=' + id,
    })
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
          // console.log(res.data.word)
          that.getPronunciation()
        }
      }
    })
  },

  // 获取发音
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
        if (res.statusCode == 200) {
          that.setData({
            pronunciation: res.data.pronunciation
          })
          console.log(res.data.pronunciation)
        }
      }
    })
  },

  pronounce(e) {
    wx.showToast({
      title: '正在播放录音...',
      icon: 'none'
    })
    let index = e.currentTarget.dataset.index
    var src = this.data.pronunciation[index].pronunciation.source
    this.innerAudioContext.src = src
    this.innerAudioContext.play()
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },

  tabSlide(e) {
    this.setData({
      TabCur: e.detail.current
    })
  }
})