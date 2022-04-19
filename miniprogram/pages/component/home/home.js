Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    list: [{
        img: 'https://HinghwaDict-1259415432.cos.ap-shanghai.myqcloud.com/files/image/6/2022/01/19/vDbjXVbhUzZ34tx.png',
        url: '/component/pinyin/pinyin'
      }, {
        img: 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/%E6%8B%BC%E9%9F%B3%E9%80%9F%E6%9F%A5.png',
        url: '/basics/search/search?index=2'
      },
      {
        img: 'https://HinghwaDict-1259415432.cos.ap-shanghai.myqcloud.com/files/image/6/2021/12/05/WrUXiZC8fTxXZAc.png',
        url: '/component/condition/condition'
      }, {
        img: 'https://hinghwadict-1259415432.cos.ap-shanghai.myqcloud.com/website/%E6%97%A5%E5%B8%B8%E7%94%A8%E8%AF%AD.png',
        url: '/component/daily/daily'
      },
      // {
      //   img: 'https://wx1.sinaimg.cn/mw690/0084vph8ly1gubp33fhtjj60p00dwn0x02.jpg',
      //   url: '/component/voice/voice'
      // }
    ]
  },

  methods: {
    getTools(e) {
      wx.navigateTo({
        url: '/pages' + e.currentTarget.dataset.url
      })
    }
  }
})