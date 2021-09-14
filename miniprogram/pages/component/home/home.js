Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    list: [{
        img: 'https://wx3.sinaimg.cn/mw690/0084vph8ly1gubp33nvf1j60p00dwwhk02.jpg',
        url: '/music/music'
      },
      {
        img: 'https://wx1.sinaimg.cn/mw690/0084vph8ly1gubp33fhtjj60p00dwn0x02.jpg',
        url: '/voice/voice'
      }]
  },

  methods: {
    getTools(e) {
      wx.navigateTo({
        url: '/pages/component' + e.currentTarget.dataset.url
      })
    }
  }
})