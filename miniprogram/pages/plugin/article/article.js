Page({
  data: {
    article: {},
    status: 0
  },

  onLoad(options) {
    // this.setData({
    //   article: JSON.parse(options.article)
    // })
  },

  focus() {
    this.setData({
      status: 1
    })
  },

  blur() {
    this.setData({
      status: 0
    })
  }
})