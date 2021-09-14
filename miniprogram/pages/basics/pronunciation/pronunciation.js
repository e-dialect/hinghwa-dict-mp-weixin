const app = getApp()

Page({
  data: {
    id: 0,
    word: '',
    pronunciation: [],
    return: false
  },

  onLoad(options) {
    this.setData({
      id: options.id,
      word: options.word
    })
    this.getPronunciation()
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext()
  },

  onShow() {
    if (this.data.return) {
      this.getPronunciation()
    } else {
      this.setData({
        return: true
      })
    }
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

  toVisitor(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/about/visitor/visitor?id=' + id,
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
    const manage = wx.getBackgroundAudioManager()
    manage.src = 'https://HinghwaDict-1259415432.cos.ap-shanghai.myqcloud.com/files/audio/8/2021/08/24/PcfkUuw87Kt06Xr.mpeg'
    manage.title = '语音'
    // let index = e.currentTarget.dataset.index
    // var src = this.data.pronunciation[index].pronunciation.source
    // console.log(src)
    // if (src == '') {
    //   wx.showToast({
    //     title: '音源为空！',
    //     icon: 'error'
    //   })
    //   return;
    // }
    // wx.showToast({
    //   title: '正在播放语音..',
    //   icon: 'none',
    //   duration: 2000
    // })
    // this.innerAudioContext.src = src
    // this.innerAudioContext.play()
  }
})