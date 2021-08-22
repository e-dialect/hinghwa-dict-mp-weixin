const app = getApp()

Page({
  data: {
    title: '',
    url: '',
    description: '',
    rawMD: '',
    code: '</>',
    status: 0
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
      success: (res) => {
        wx.uploadFile({
          url: "https://www.yuyinws.top/api/imgUpload",
          filePath: res.tempFilePaths[0],
          name: "file",
          success: (res) => {
            console.log(res)
            let data = JSON.parse(res.data)
            that.setData({
              url: data.url
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
      }
    })
  },

  getDescription(e) {
    this.setData({
      description: e.detail.value
    })
  },

  changeStatus() {
    let data = this.data.status
    this.setData({
      status: (data + 1) % 2
    })
  },

  getContent(e) {
    this.setData({
      rawMD: e.detail.value
    })
  },

  tip(e) {
    var tip = e.currentTarget.dataset.fh
    if (tip == "code") {
      tip = "``` js\ninput your code\n```";
    } else if (tip == "link") {
      tip = "[url](https://)";
    } else if (tip == 'table') {
      tip = "|h|h|\n|--|--|\n|b|b|"
    }
    let data = this.data.rawMD + tip
    this.setData({
      rawMD: data
    })
  },

  uploadImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        wx.uploadFile({
          url: "https://www.yuyinws.top/api/imgUpload",
          filePath: res.tempFilePaths[0],
          name: "file",
          success: (res) => {
            let data = JSON.parse(res.data)
            data = that.data.rawMD + '![image](' + data.url + ')';
            that.setData({
              rawMD: data
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
      }
    })
  },

  release() {
    console.log(this.data)
    let title = this.data.title
    let url = this.data.url
    let description = this.data.description
    let rawMD = this.data.rawMD
    if (title == '' || url == '' || description == '' || rawMD == '') {
      wx.showToast({
        title: '文章内容不完整',
        icon: 'error'
      })
    } else {
      // 创建文章
      wx.request({
        url: app.globalData.server + 'articles',
        // url: 'http://127.0.0.1:4523/mock/404238/articles',
        method: 'POST',
        data: {
          title: title,
          description: description,
          content: rawMD,
          cover: url
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