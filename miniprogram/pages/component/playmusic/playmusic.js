const app = getApp()

Page({
  data: {
    music: {},
    duration: 0,
    img: '/images/music/play.png',
    duration: 0,
    current_time: '0:00',
    end_time: '0:00',
    percent: 0
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

  initAudio() {
    let music = this.data.music
    // 创建播放器
    wx.playBackgroundAudio({
      dataUrl: music.source,
      title: music.title,
      coverImgUrl: music.cover
    })
    // 监听音乐播放
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        img: '/images/music/pause.png'
      })
    })
    // 监听音乐暂停
    wx.onBackgroundAudioPause(() => {
      this.setData({
        img: '/images/music/play.png'
      })
    })
    // 监听音乐停止
    wx.onBackgroundAudioStop(() => {})
    // 监听播放拿取播放进度
    const manage = wx.getBackgroundAudioManager()
    manage.onTimeUpdate(() => {
      if (this.data.duration == 0) {
        this.setData({
          duration: manage.duration,
          end_time: this.formatTime(manage.duration)
        })
      }
      const currentTime = manage.currentTime
      this.setData({
        current_time: this.formatTime(currentTime),
        percent: currentTime * 100 / this.data.duration
      })
    })
  },

  playAndPause() {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status
        if (status == 1) {
          wx.pauseBackgroundAudio()
        } else {
          wx.playBackgroundAudio()
        }
      }
    })
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
})