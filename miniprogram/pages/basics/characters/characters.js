Page({
  data: {
    character: {}
  },

  onLoad(options) {
    this.setData({
      character: JSON.parse(options.character)
    })
  }
})