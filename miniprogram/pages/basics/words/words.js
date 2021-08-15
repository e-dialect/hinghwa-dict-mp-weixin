Page({
  data: {
    word: {}
  },

  onLoad(options) {
    this.setData({
      word: JSON.parse(options.word)
    })
  }
})