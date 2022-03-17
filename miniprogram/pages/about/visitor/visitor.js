const app = getApp()

Page({
  data: {
    id: 0,
    avatar: '',
    nickname: '',
    recordsCount: 0,
    wordsCount: 0,
    visitTotal: 0
  },

  onLoad(options) {
    let id = options.id
    this.getInfo(id)
  },

  // 获取用户信息
  getInfo(id) {
    let that = this
    wx.request({
      url: app.globalData.server + 'users/' + id,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            id: res.data.user.id,
            avatar: res.data.user.avatar,
            nickname: res.data.nickname,
            recordsCount: res.data.contribution.pronunciation,
            wordsCount: res.data.contribution.word,
            visitTotal: res.data.contribution.listened
          })
        }
      }
    })
  },

  getMyRecords() {
    let id = this.data.id
    wx.navigateTo({
      url: '/pages/component/voice/voice?id=' + id,
    })
  },

  // 返回上一页面
  // back() {
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // }
})