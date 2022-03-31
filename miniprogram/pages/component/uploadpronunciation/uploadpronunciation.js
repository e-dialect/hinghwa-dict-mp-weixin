const app = getApp()
const countys = ['城厢区', '涵江区', '荔城区', '秀屿区', '仙游县']
const towns = [
  ['龙桥街道', '凤凰山街道', '霞林街道', '常太镇', '华亭镇', '灵川镇', '东海镇'],
  ['涵东街道', '涵西街道', '三江口镇', '白塘镇', '国欢镇', '梧塘镇', '江口镇', '萩芦镇', '白沙镇', '庄边镇', '新县镇', '大洋乡'],
  ['镇海街道', '拱辰街道', '西天尾镇', '黄石镇', '新度镇', '北高镇'],
  ['笏石镇', '东庄镇', '忠门镇', '东埔镇', '东峤镇', '埭头镇', '平海镇', '南日镇', '湄洲镇', '山亭镇', '月塘乡'],
  ['鲤城街道', '枫亭镇', '榜头镇', '郊尾镇', '度尾镇', '鲤南镇', '赖店镇', '盖尾镇', '园庄镇', '大济镇', '龙华镇', '钟山镇', '游洋镇', '西苑乡', '石苍乡', '社硎乡', '书峰乡', '菜溪乡']
]

Page({
  data: {
    id: 0,
    word: '',
    ipa: '',
    pinyin: '',
    status: 0,
    source: '',
    multiIndex: [0, 0],
    multiArray: [
      countys,
      towns[0]
    ]
  },

  onLoad(options) {
    this.setData({
      id: options.id,
      word: options.word,
      ipa: options.ipa,
      pinyin: options.pinyin
    })

    if (app.globalData.userInfo.county) {
      console.log(app.globalData.userInfo)
      let index_0 = countys.indexOf(app.globalData.userInfo.county)
      let index_1 = towns[index_0].indexOf(app.globalData.userInfo.town)
      let multiArray = this.data.multiArray
      multiArray[1] = towns[index_0]
      this.setData({
        multiIndex: [index_0, index_1],
        multiArray: multiArray
      })
    } else {
      wx.showModal({
        title: '地区tip',
        content: '在个人页面中点击头像可进入设置页面，设置地区之后默认读取到当前页面的地区项。',
        showCancel: false
      })
    }

    var that = this;
    // 创建录音管理器
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onError(function () {
      that.tip("录音失败！")
    })
    this.recorderManager.onStop(function (res) {
      that.setSource(res.tempFilePath)
      // that.uploadMp3(res.tempFilePath)
    })
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！")
    })
  },

  // recordOrOver() {
  //   // 未在录音
  //   if (this.data.status == 0) {
  //     this.setData({
  //       status: 1
  //     })
  //     // 开始录音
  //     this.recorderManager.start({
  //       format: 'mp3'
  //     })
  //   }
  //   // 正在录音
  //   else if (this.data.status == 1) {
  //     this.setData({
  //       status: 0
  //     })
  //     // 结束录音
  //     this.recorderManager.stop()
  //   }
  // },

  startRecord() {
    this.setData({
      status: 1
    })
    wx.showToast({
      title: '正在录音...',
      icon: 'none'
    })
    // 开始录音
    this.recorderManager.start({
      format: 'mp3'
    })
  },

  stopRecord() {
    this.setData({
      status: 0
    })
    // 结束录音
    this.recorderManager.stop()
  },

  setSource(source) {
    this.setData({
      source: source
    })
    wx.showToast({
      title: '录音成功',
    })
  },

  playMp3() {
    var src = this.data.source;
    if (src == '') {
      wx.showToast({
        title: '请先录音',
        icon: 'error'
      })
      return;
    } else {
      wx.showToast({
        title: '正在播放录音...',
        icon: 'none'
      })
    }
    this.innerAudioContext.src = src;
    this.innerAudioContext.play()
  },

  multiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },

  columnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    if (e.detail.column == 0) {
      switch (data.multiIndex[0]) {
        case 0:
          data.multiArray[1] = towns[0]
          break;
        case 1:
          data.multiArray[1] = towns[1]
          break;
        case 2:
          data.multiArray[1] = towns[2]
          break;
        case 3:
          data.multiArray[1] = towns[3]
          break;
        case 4:
          data.multiArray[1] = towns[4]
          break;
      }
      this.setData(data)
    }
  },

  release(e) {
    wx.showLoading({
      title: '正在提交...',
    })
    let pronunciation = {
      word: this.data.id,
      source: this.data.source,
      ipa: e.detail.value.ipa,
      pinyin: e.detail.value.pinyin,
      county: countys[this.data.multiIndex[0]],
      town: towns[this.data.multiIndex[0]][this.data.multiIndex[1]]
    }
    this.uploadMp3(pronunciation)
  },

  // 上传.mp3文件
  uploadMp3(pronunciation) {
    let that = this
    wx.uploadFile({
      url: app.globalData.server + 'website/files',
      filePath: pronunciation.source,
      name: 'file',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        if (res.statusCode == 200) {
          let url = JSON.parse(res.data).url
          pronunciation.source = url
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
              if (res.statusCode == 200) {
                wx.hideLoading()
                wx.showToast({
                  title: '发布成功'
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
      }
    })
  },

  // 重新录制
  reRecord() {
    this.setData({
      source: ''
    })
  }
})