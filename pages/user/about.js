const app = getApp();
Page({
  data: {
      contents: []
  },
  onLoad() {
      app.util.request({
          url: '/user/about'
      }).then(res => {
          this.setData({
              contents: res.data
          })
      })
  }
})
