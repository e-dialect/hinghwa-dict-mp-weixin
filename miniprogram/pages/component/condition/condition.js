const app = getApp()
const utils = require('../../../resourse/syd.js')

Page({
  data: {
    index: 0,
    shengmu: [],
    yunmu: [
      [],
      []
    ],
    multiIndex: [0, 0],
    index1: 0,
    shengdiao: [],
    characters: []
  },

  onLoad() {
    // 获取声母
    let shengmu = []
    for (let k in utils.shengmu) {
      shengmu.push(utils.shengmu[k])
    }
    this.setData({
      shengmu: shengmu
    })
    // 获取韵母
    let yunmu = [
      [],
      []
    ]
    for (let i = 0; i < utils.yunmu.length; i++) {
      if (i == 0) {
        for (let j = 0; j < utils.yunmu[0].children.length; j++) {
          yunmu[1].push(utils.yunmu[0].children[j].label)
        }
      }
      yunmu[0].push(utils.yunmu[i].label)
    }
    this.setData({
      yunmu: yunmu
    })
    // 获取声调
    let shengdiao = []
    for (let k in utils.shengdiao) {
      shengdiao.push(utils.shengdiao[k])
    }
    shengdiao.unshift(shengdiao[shengdiao.length - 1])
    shengdiao.pop()
    this.setData({
      shengdiao: shengdiao
    })
  },

  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },

  MultiColumnChange(e) {
    let data = {
      yunmu: this.data.yunmu,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        data.yunmu[1] = []
        switch (data.multiIndex[0]) {
          case 0:
            for (let i = 0; i < utils.yunmu[0].children.length; i++) {
              data.yunmu[1].push(utils.yunmu[0].children[i].label)
            }
            break;
          case 1:
            for (let i = 0; i < utils.yunmu[1].children.length; i++) {
              data.yunmu[1].push(utils.yunmu[1].children[i].label)
            }
            break;
          case 2:
            for (let i = 0; i < utils.yunmu[2].children.length; i++) {
              data.yunmu[1].push(utils.yunmu[2].children[i].label)
            }
            break;
          case 3:
            for (let i = 0; i < utils.yunmu[3].children.length; i++) {
              data.yunmu[1].push(utils.yunmu[3].children[i].label)
            }
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  PickerChange1(e) {
    this.setData({
      index1: e.detail.value
    })
  },

  getShengmu() {
    let shengmu = this.data.shengmu[this.data.index]
    for (let k in utils.shengmu) {
      if (utils.shengmu[k] == shengmu) {
        return k
      }
    }
  },

  getYunmu() {
    for (let i = 0; i < utils.yunmu.length; i++) {
      if (utils.yunmu[i].label == this.data.yunmu[0][this.data.multiIndex[0]]) {
        for (let j = 0; j < utils.yunmu[i].children.length; j++) {
          if (utils.yunmu[i].children[j].label == this.data.yunmu[1][this.data.multiIndex[1]]) {
            return utils.yunmu[i].children[j].value
          }
        }
      }
    }
  },

  getShengdiao() {
    let shengdiao = this.data.shengdiao[this.data.index1]
    for (let k in utils.shengdiao) {
      if (utils.shengdiao[k] == shengdiao) {
        return k
      }
    }
  },

  searchByConditions() {
    // 获取声母、韵母和声调
    let shengmu = this.getShengmu()
    let yunmu = this.getYunmu()
    let shengdiao = this.getShengdiao()
    if (shengmu == 'all' && yunmu == 'all' && shengdiao == 'all') {
      let that = this
      wx.showModal({
        content: '这样搜索共有5765个结果，若要显示可能需要一定的时间，请确认是否继续？',
        success(res) {
          if (res.confirm) {
            that.search(shengmu, yunmu, shengdiao)
          }
        }
      })
    } else {
      this.search(shengmu, yunmu, shengdiao)
    }
  },

  search(shengmu, yunmu, shengdiao) {
    if (shengmu == 'all') {
      shengmu = ''
    } else {
      shengmu = 'shengmu=' + shengmu
    }
    if (yunmu == 'all') {
      yunmu = ''
    } else {
      yunmu = '&yunmu=' + yunmu
    }
    if (shengdiao == 'all') {
      shengdiao = ''
    } else {
      shengdiao = '&shengdiao=' + shengdiao
    }
    // 发起条件检索
    let that = this
    wx.request({
      url: app.globalData.server + 'characters?' + shengmu + yunmu + shengdiao,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.statusCode == 200) {
          var arr = res.data.characters
          if (arr.length == 0) {
            wx.showToast({
              title: "检索结果为空！",
              icon: 'none'
            })
            that.setData({
              characters: []
            })
          } else {
            wx.showLoading()
            wx.request({
              url: app.globalData.server + 'characters',
              method: 'PUT',
              data: {
                characters: arr
              },
              header: {
                'content-type': 'application/json',
              },
              success(res) {
                if (res.statusCode == 200) {
                  console.log(res)
                  wx.hideLoading()
                  if (res.data.characters.length > 1000) {
                    res.data.characters = res.data.characters.slice(0, 1000)
                  }
                  that.setData({
                    characters: res.data.characters
                  })
                }
              }
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
          })
        }
      }
    })
  }
})