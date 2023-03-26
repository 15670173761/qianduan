const app = getApp();
Page({
  data: {
      contents: []
  },
  onLoad() {
      app.util.request({
          url: '/commission/agreement'
      }).then(res => {
          this.setData({
              contents: res.data
          })
      })
  }
})
