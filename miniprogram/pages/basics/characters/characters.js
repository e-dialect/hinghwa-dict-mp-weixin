const app = getApp()

Page({
  data: {
    character: {},
  },

  onLoad(options) {
    this.getCharacter(options.id)
  },

  // 获取单字信息
  getCharacter(id) {
    let that = this
    wx.request({
      url: app.globalData.server + 'characters/' + id,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            character: res.data.character
          })
          // that.getIpaPronunciation()
        }
      }
    })
  },

  // 获取ipa发音
  // getIpaPronunciation() {
  //   let that = this
  //   wx.request({
  //     url: app.globalData.server + 'pronunciation/' + that.data.character.ipa,
  //     method: 'GET',
  //     data: {},
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success(res) {
  //       console.log(res)
  //     }
  //   })
  // }
})