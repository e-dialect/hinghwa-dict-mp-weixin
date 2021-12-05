const app = getApp()

Page({
  data: {
    id: 0,
    word: '',
    status: 0,
    source: ''
  },

  onLoad(options) {
    this.setData({
      id: options.id,
      word: options.word
    })
    var that = this;
    // 创建录音管理器
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onError(function () {
      that.tip("录音失败！")
    })
    this.recorderManager.onStop(function (res) {
      that.uploadMp3(res.tempFilePath)
    })
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！")
    })
  },

  recordOrOver() {
    // 未在录音
    if (this.data.status == 0) {
      this.setData({
        status: 1
      })
      // 开始录音
      this.recorderManager.start()
    }
    // 正在录音
    else if (this.data.status == 1) {
      this.setData({
        status: 0
      })
      // 结束录音
      this.recorderManager.stop()
    }
  },

  // 上传.mp3文件
  uploadMp3(source) {
    let that = this
    console.log(source)
    wx.uploadFile({
      url: app.globalData.server + 'website/files',
      filePath: source,
      name: 'file',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        if (res.statusCode == 200) {
          let url = JSON.parse(res.data).url
          that.setData({
            source: url
          })
          wx.showToast({
            title: '录音成功！',
          })
        }
      }
    })
  },

  playMp3() {
    var src = this.data.source;
    if (src == '') {
      wx.showToast({
        title: '请先录音！',
        icon: 'error'
      })
      return;
    }
    this.innerAudioContext.src = src;
    this.innerAudioContext.play()
  },

  release(e) {
    let pronunciation = {
      word: this.data.id,
      source: e.detail.value.source,
      ipa: e.detail.value.ipa,
      pinyin: e.detail.value.pinyin,
      county: e.detail.value.county,
      town: e.detail.value.town
    }
    if (!pronunciation.source || !pronunciation.ipa || !pronunciation.pinyin || !pronunciation.county || !pronunciation.town) {
      wx.showToast({
        title: '信息不完整',
        icon: 'error'
      })
      return;
    }
    wx.request({
      url: app.globalData.server + 'pronunciation',
      method: 'POST',
      data: {
        pronunciation: pronunciation
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '发布成功！'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 500)
        }
      }
    })
  }
})