const app = getApp()

Page({
  data: {
    music: []
  },

  onShow() {
    // 获取音乐列表
    this.getMusic()
  },

  getMusic() {
    let that = this
    wx.request({
      url: app.globalData.server + 'music',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          let arr = res.data.music
          wx.request({
            url: app.globalData.server + 'music',
            method: 'PUT',
            data: {
              music: arr
            },
            header: {
              'content-type': 'application/json'
            },
            success(res) {
              console.log(res.data)
              if (res.statusCode == 200) {
                that.setData({
                  music: res.data.music
                })
              }
            }
          })
        }
      }
    })
  },

  uploadMusic() {
    wx.navigateTo({
      url: '/pages/component/uploadmusic/uploadmusic',
    })
  },

  playMusic(e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.music[index].music.id
    wx.navigateTo({
      url: '/pages/component/playmusic/playmusic?id=' + id,
    })
  },

  likeMusic() {
    console.log('like')
  }
})