const app = getApp()
const countys = ['城厢区', '涵江区', '荔城区', '秀屿区', '仙游县']
const towns = [
  ['龙桥街道', '凤凰山街道', '霞林街道', '常太镇', '华亭镇', '灵川镇', '东海镇'],
  ['涵东街道', '涵西街道', '三江口镇', '白塘镇', '国欢镇', '梧塘镇', '江口镇', '萩芦镇', '白沙镇', '庄边镇', '新县镇', '大洋乡'],
  ['镇海街道', '拱辰街道', '西天尾镇', '黄石镇', '新度镇', '北高镇'],
  ['笏石镇', '东庄镇', '忠门镇', '东埔镇', '东峤镇', '埭头镇', '平海镇', '南日镇', '湄洲镇', '山亭镇', '月塘乡'],
  ['鲤城街道', '枫亭镇', '榜头镇', '郊尾镇', '度尾镇', '鲤南镇', '赖店镇', '盖尾镇', '园庄镇', '大济镇', '龙华镇', '钟山镇', '游洋镇', '西苑乡', '石苍乡', '社硎乡', '书峰乡', '菜溪乡']
]

Page({
  data: {
    avatar: '',
    nickname: '',
    email: '',
    phone: '',
    date: '未知',
    multiIndex: [0, 0],
    multiArray: [
      countys,
      towns[0]
    ]
  },

  onLoad() {
    if (app.globalData.userInfo.birthday) {
      this.setData({
        date: app.globalData.userInfo.birthday
      })
    }
    if (app.globalData.userInfo.county) {
      let index_0 = countys.indexOf(app.globalData.userInfo.county)
      let index_1 = towns[index_0].indexOf(app.globalData.userInfo.town)
      let multiArray = this.data.multiArray
      multiArray[1] = towns[index_0]
      this.setData({
        multiIndex: [index_0, index_1],
        multiArray: multiArray
      })
    }
  },

  onShow() {
    this.setData({
      avatar: app.globalData.userInfo.avatar,
      nickname: app.globalData.userInfo.nickname,
      email: app.globalData.userInfo.email,
      phone: app.globalData.userInfo.telephone,
    })
  },

  chooseAvatar() {
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success(res) {
        const tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.globalData.server + 'website/files',
          filePath: tempFilePaths,
          name: 'file',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            if (res.statusCode == 200) {
              let url = JSON.parse(res.data).url
              app.globalData.data = {
                'avatar': url
              }
              that.setData({
                avatar: url
              })
              that.changeAvatar(url)
            }
          }
        })
      }
    })
  },

  changeAvatar(url) {
    wx.request({
      url: app.globalData.server + 'users/' + app.globalData.id,
      method: 'PUT',
      data: {
        user: app.globalData.userInfo
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.setStorage({
            data: res.data.token,
            key: 'token',
          })
          wx.showToast({
            title: '修改成功',
          })
        } else {
          wx.showToast({
            title: '服务器错误',
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  },

  changeNickname() {
    wx.navigateTo({
      url: '/pages/about/nickname/nickname',
    })
  },

  changeEmail() {
    wx.navigateTo({
      url: '/pages/about/email/email',
    })
  },

  changePhone() {
    wx.navigateTo({
      url: '/pages/about/phone/phone',
    })
  },

  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
    app.globalData.userInfo.birthday = e.detail.value
    wx.request({
      url: app.globalData.server + 'users/' + app.globalData.id,
      method: 'PUT',
      data: {
        user: app.globalData.userInfo
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success(res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          wx.setStorage({
            data: res.data.token,
            key: 'token',
          })
          wx.showToast({
            title: '修改成功',
          })
        } else {
          wx.showToast({
            title: '服务器错误',
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  },

  // RegionChange(e) {
  //   var region = e.detail.value
  //   this.setData({
  //     region: region
  //   })
  //   app.globalData.userInfo.county = region[1]
  //   app.globalData.userInfo.town = region[2]
  //   wx.request({
  //     url: app.globalData.server + 'users/' + app.globalData.id,
  //     method: 'PUT',
  //     data: {
  //       user: app.globalData.userInfo
  //     },
  //     header: {
  //       'content-type': 'application/json',
  //       'token': app.globalData.token
  //     },
  //     success(res) {
  //       console.log(res.data)
  //       if (res.statusCode == 200) {
  //         wx.setStorage({
  //           data: res.data.token,
  //           key: 'token',
  //         })
  //       } else {
  //         wx.showToast({
  //           title: '服务器错误',
  //         })
  //       }
  //     },
  //     fail(err) {
  //       wx.showToast({
  //         title: '网络异常',
  //       })
  //     }
  //   })
  // },

  multiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
    app.globalData.userInfo.county = this.data.multiArray[0][this.data.multiIndex[0]]
    app.globalData.userInfo.town = this.data.multiArray[1][this.data.multiIndex[1]]
    wx.request({
      url: app.globalData.server + 'users/' + app.globalData.id,
      method: 'PUT',
      data: {
        user: app.globalData.userInfo
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.setStorage({
            data: res.data.token,
            key: 'token',
          })
        } else {
          wx.showToast({
            title: '服务器错误',
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  },

  columnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    if (e.detail.column == 0) {
      switch (data.multiIndex[0]) {
        case 0:
          data.multiArray[1] = towns[0]
          break;
        case 1:
          data.multiArray[1] = towns[1]
          break;
        case 2:
          data.multiArray[1] = towns[2]
          break;
        case 3:
          data.multiArray[1] = towns[3]
          break;
        case 4:
          data.multiArray[1] = towns[4]
          break;
      }
      this.setData(data)
    }
  }
})