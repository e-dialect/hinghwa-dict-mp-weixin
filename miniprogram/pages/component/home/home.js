Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    list: [{
        img: 'https://HinghwaDict-1259415432.cos.ap-shanghai.myqcloud.com/files/image/6/2022/01/19/vDbjXVbhUzZ34tx.png',
        url: '/pinyin/pinyin'
      },
      {
        img: 'https://wx1.sinaimg.cn/mw690/0084vph8ly1gubp33fhtjj60p00dwn0x02.jpg',
        url: '/voice/voice'
      }, {
        img: 'https://HinghwaDict-1259415432.cos.ap-shanghai.myqcloud.com/files/image/6/2021/12/05/WrUXiZC8fTxXZAc.png',
        url: '/condition/condition'
      }, {
        img: 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/%E6%97%A5%E5%B8%B8%E7%94%A8%E8%AF%AD.png',
        url: '/daily/daily'
      }
    ]
  },

  methods: {
    getTools(e) {
      wx.navigateTo({
        url: '/pages/component' + e.currentTarget.dataset.url
      })
    }
  }
})