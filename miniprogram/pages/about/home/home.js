const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    avatar: '',
    username: '',
    recordsCount: 0,
    wordsCount: 0,
    visitTotal: 0
  },

  lifetimes: {
    attached() {
      var that = this
      app.watch(function (value) {
        that.setData({
          avatar: value.avatar
        })
      })
      this.setData({
        avatar: app.globalData.userInfo.avatar,
        username: app.globalData.userInfo.username
      })
      wx.showLoading({
        title: '数据加载中',
        mask: true
      })
      let i = 0
      numDH();

      function numDH() {
        if (i < 20) {
          setTimeout(function () {
            that.setData({
              recordsCount: i,
              wordsCount: i,
              visitTotal: i
            })
            i++
            numDH()
          }, 20)
        } else {
          that.setData({
            recordsCount: that.coutNum(app.globalData.contribution.pronunciation),
            wordsCount: that.coutNum(app.globalData.contribution.word),
            visitTotal: that.coutNum(app.globalData.contribution.listened)
          })
        }
      }
      wx.hideLoading()
    },
  },

  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },

    //进入个人信息页面
    userInfo() {
      wx.navigateTo({
        url: '/pages/about/userinfo/userinfo',
      })
    }
  }
})