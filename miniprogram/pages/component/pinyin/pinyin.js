const app = getApp()
const utils = require('../../../resourse/pinyin.js')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    display: [false, false, false, false],
    toggleDelay: true,
    TabCur: 0,
    list: [{
        color: 'red',
        desc: '介绍'
      },
      {
        color: 'orange',
        desc: '声母'
      },
      {
        color: 'cyan',
        desc: '韵母'
      },
      {
        color: 'blue',
        desc: '声调'
      }
    ],
    list1:["开尾韵", "鼻尾韵", "塞尾韵"],
    shengmu: utils.shengmu,
    yunmu: [utils.kai, utils.bi, utils.se],
    tone: utils.tone
  },

  onLoad: function () {
    let that = this
    setTimeout(function () {
      that.setData({
        toggleDelay: false
      })
    }, 1000)
    // 创建播放器
    this.innerAudioContext = wx.createInnerAudioContext()
  },

  selectModel(e) {
    let index = e.currentTarget.dataset.id
    let display = [false, false, false, false]
    display[index] = true
    this.setData({
      display: display
    })
  },

  playShengmu(e) {
    let index = e.currentTarget.dataset.id
    let src = "https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/pinyin/example/"+ this.data.shengmu[index].pinyin + ".mp3"
    this.innerAudioContext.src = src
    this.innerAudioContext.play()
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },

  playYunmu(e) {
    let index1 = this.data.TabCur
    let index2 = e.currentTarget.dataset.id
    let src = "https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/pinyin/example/"+ this.data.yunmu[index1][index2].pinyin + ".mp3"
    this.innerAudioContext.src = src
    this.innerAudioContext.play()
  },

  playTone(e) {
    let index = e.currentTarget.dataset.id
    let src = "https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/pinyin/example/"+ this.data.tone[index].type + ".mp3"
    this.innerAudioContext.src = src
    this.innerAudioContext.play()
  }
})