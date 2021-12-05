const app = getApp()

Page({
  data: {
    music: {},
    icon: 'cuIcon-stop',
    duration: 0,
    current_time: '0:00',
    end_time: '0:00',
    progress: 0,
    is_changing: 0
  },

  onLoad(options) {
    this.getMusic(options.id)
  },

  getMusic(id) {
    let that = this
    wx.request({
      url: app.globalData.server + 'music/' + id,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            music: res.data.music
          })
          that.initAudio()
        }
      }
    })
  },

  toVisitor() {
    let id = this.data.music.contributor.id
    wx.navigateTo({
      url: '/pages/about/visitor/visitor?id=' + id,
    })
  },

  initAudio() {
    let music = this.data.music
    const manage = wx.getBackgroundAudioManager()
    manage.src = music.source
    manage.title = music.title
    manage.coverImgUrl = music.cover
    manage.onTimeUpdate(() => {
      if (this.data.duration == 0) {
        this.setData({
          duration: manage.duration,
          end_time: this.formatTime(manage.duration)
        })
      }
      const currentTime = manage.currentTime
      if (this.data.is_changing == 0) {
        this.setData({
          current_time: this.formatTime(currentTime),
          progress: currentTime * 1000 / this.data.duration
        })
      }
    })
  },

  playAndPause() {
    const manage = wx.getBackgroundAudioManager()
    if (manage.paused == false) {
      this.setData({
        icon: 'cuIcon-playfill'
      })
      manage.pause()
    } else {
      this.setData({
        icon: 'cuIcon-stop'
      })
      manage.play()
    }
  },

  changingProgress(e) {
    if (this.data.is_changing == 0) {
      this.setData({
        is_changing: 1
      })
    } else {
      let current_time = (e.detail.value / 1000) * this.data.duration
      this.setData({
        current_time: this.formatTime(current_time)
      })
    }
  },

  changeProgress(e) {
    let current_time = (e.detail.value / 1000) * this.data.duration
    const manage = wx.getBackgroundAudioManager()
    manage.seek(current_time)
    let that = this
    setTimeout(function () {
      that.setData({
        current_time: that.formatTime(current_time),
        progress: e.detail.value,
        is_changing: 0
      })
    }, 100)

  },

  // 格式化时间
  formatTime: function (interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this.pad(interval % 60)
    return `${minute}:${second}`
  },

  // 秒前加0
  pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  }
})