//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },

  globalData: {
    server: 'https://api.pxm.edialect.top/',
    id: '',
    token: '',
    userInfo: {},
    publish_articles: [],
    publish_comments: [],
    like_articles: [],
    contribution: {},
    status: 0,
    word: {},
    data: {},
  },

  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "data", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        if (value.avatar) {
          this.userInfo.avatar = value.avatar;
        }
        if (value.nickname) {
          this.userInfo.nickname = value.nickname
        }
        method(value);
      },
      get: function () {
        return this.globalData;
      }
    })
  },
})