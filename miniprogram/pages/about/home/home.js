const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    avatar: '',
    username: '',
    recordsCount: 0,
    articlesCount: 0,
    visitTotal: 0
  },
  lifetimes: {
    attached() {
      var that = this
      app.watch(function (value) {
        that.setData({
          avatar: value.avatar,
          username: value.username
        })
      })
      this.setData({
        avatar: app.globalData.userInfo.avatar,
        nickname: app.globalData.userInfo.nickname
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
              articlesCount: i,
              visitTotal: i
            })
            i++
            numDH()
          }, 20)
        } else {
          that.setData({
            recordsCount: that.coutNum(3000),
            articlesCount: that.coutNum(484),
            visitTotal: that.coutNum(24000)
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