const app = getApp()

Page({
  data: {
    pwd: [{
        str: '原密码',
        ph: '请输入原密码',
        is_pwd: true,
        icon: 'cuIcon-attention',
        name: 'old'
      }, {
        str: '新密码',
        ph: '请输入新密码',
        is_pwd: true,
        icon: 'cuIcon-attention',
        name: 'new1'
      },
      {
        str: '确认密码',
        ph: '请确认新密码',
        is_pwd: true,
        icon: 'cuIcon-attention',
        name: 'new2'
      }
    ]
  },

  changeStatus(e) {
    let index = e.currentTarget.dataset.index
    let pwd = this.data.pwd
    if (pwd[index].is_pwd == true) {
      pwd[index].is_pwd = false
      pwd[index].icon = "cuIcon-attentionforbid"
    } else {
      pwd[index].is_pwd = true
      pwd[index].icon = "cuIcon-attention"
    }
    this.setData({
      pwd: pwd
    })
  },

  changePassword(e) {
    let old = e.detail.value.old
    let new1 = e.detail.value.new1
    let new2 = e.detail.value.new2
    if (old == '' || new1 == '' || new2 == '') {
      wx.showToast({
        title: '内容不完整',
        icon: 'error'
      })
      return;
    } else if (new1 != new2) {
      wx.showToast({
        title: '两次密码不一样',
        icon: 'error'
      })
      return;
    }
    // 修改密码
    wx.request({
      url: app.globalData.server + 'users/' + app.globalData.id + '/password',
      method: 'PUT',
      data: {
        oldpassword: old,
        newpassword: new1
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        } else if (res.statusCode == 401) {
          wx.showModal({
            content: '没有权限或原密码错误',
          })
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: '服务器错误',
            icon: 'error'
          })
        }
      }
    })
  }
})