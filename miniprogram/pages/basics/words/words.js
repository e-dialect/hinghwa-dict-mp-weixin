const app = getApp()

Page({
  data: {
    id: 0,
    word: {},
    definition: [],
    pronunciation: [],
    TabCur: 0,
    tabs: ['释义', '发音', '附注'],
    platform: '',
    isShare: 0,
    no_pronunciations: false
  },

  //右上角分享功能
  onShareAppMessage() {
    var that = this
    var title = this.data.word.word
    var id = this.data.word.id
    return {
      title: title,
      path: '/pages/basics/words/words?id=' + id + '&share=1',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onLoad(options) {
    if (options.share) {
      this.setData({
        isShare: options.share
      })
    }
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

  navigateToIndex() {
    wx.navigateTo({
      url: '/pages/index/index?status=basics'
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
          that.splitDefinition(res.data.word.definition)
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
          if (res.data.pronunciation.length === 0) {
            that.setData({
              no_pronunciations: true
            })
          }
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
  },

  /**
   * 具体解析一个待解析的字符串
   * @param definition 具体待解析的字符串
   */
  analyseDefinition(definition, num) {
    let index = definition.indexOf('：')
    if (index === -1) {
      index = definition.indexOf('△')
      if (index === -1) {
        index = definition.length
      } else {
        index = index - 1
      }
    }
    const result = {
      content: num + definition.substring(0, index),
      example: []
    }
    let status = 1 // 1：现在是例子；0：现在是例子的解释
    let example = {
      type: '例',
      content: '',
      explain: ''
    }

    for (const char of definition.substring(index + 1)) {
      if (char === '（') {
        // 例子解释开始
        status = 0
      } else if (char === '）') {
        // 例子解释结束
        status = 1
      } else if (status === 0) {
        // 例子解释内容
        example.explain = example.explain + char
      } else if (char === '△') {
        // 例子类型
        example.type = '俗'
      } else if (char === '|' || char === '。') {
        // 一个例子结束
        result.example.push(example)
        example = {
          type: '例',
          content: '',
          explain: ''
        }
      } else {
        // 例子的内容
        example.content = example.content + char
      }
    }
    return result
  },

  /**
   * 将数据库中的释义字符串进行拆分
   * @param definition 释义字符串
   */
  splitDefinition(definition) {
    const order = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
    let lastIndex = -1
    const result = []
    let i = 0
    for (i = 0; i < order.length; i++) {
      const index = definition.indexOf(order[i])
      if (index < 0) break
      if (lastIndex !== -1) {
        result.push(this.analyseDefinition(definition.substring(lastIndex, index), order[i - 1]))
      }
      lastIndex = index + 1
    }
    if (i == 0) {
      result.push(this.analyseDefinition(definition.substring(lastIndex), ""))
    } else {
      result.push(this.analyseDefinition(definition.substring(lastIndex), order[i - 1]))
    }
    this.setData({
      definition: result
    })
  },

  uploadPronunciation() {
    let id = this.data.id,
      word = this.data.word.word,
      ipa = this.data.word.standard_ipa,
      pinyin = this.data.word.standard_pinyin
    wx.navigateTo({
      url: '/pages/component/uploadpronunciation/uploadpronunciation?id=' + id + '&word=' + word + '&ipa=' + ipa + '&pinyin=' + pinyin,
    })
  },
})