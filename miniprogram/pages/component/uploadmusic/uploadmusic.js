const app = getApp()

Page({
  data: {
    title: '',
    cover: '',
    src: '',
    artist: ''
  },

  getTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },

  getCover() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        wx.uploadFile({
          url: app.globalData.server + 'website/files',
          filePath: res.tempFilePaths[0],
          name: "file",
          header: {
            'token': app.globalData.token
          },
          success: (res) => {
            console.log(res)
            let data = JSON.parse(res.data)
            that.setData({
              cover: data.url
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
      }
    })
  },

  getSource(e) {
    this.setData({
      src: e.detail.value
    })
  },

  getArtist(e) {
    this.setData({
      artist: e.detail.value
    })
  },

  release() {
    console.log(this.data)
    let title = this.data.title
    let cover = this.data.cover
    let src = this.data.src
    let artist = this.data.artist
    if (title == '' || cover == '' || src == '' || artist == '') {
      wx.showToast({
        title: '音乐内容不完整',
        icon: 'error'
      })
    } else {
      // 创建音乐
      wx.request({
        url: app.globalData.server + 'music',
        method: 'POST',
        data: {
          title: title,
          cover: cover,
          source: src,
          artist: artist
        },
        header: {
          'content-type': 'application/json',
          'token': app.globalData.token
        },
        success(res) {
          if (res.statusCode == 200) {
            wx.showToast({
              title: '发布成功',
              duration: 2000,
              success(res) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 500);
              }
            })
          }
        }
      })
    }
  }
})