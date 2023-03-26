const app = getApp()
Page({
    data: {
        qrcode: ''
    },
    onLoad() {
        this.getInviteQrcode()
    },
    getInviteQrcode: function() {
        app.util.request({
            url: '/commission/memberInviteQrcode'
        }).then((res) => {
           this.setData({
               qrcode: res.data.qrcode
           })
        })
    },
    saveImage() {
        if(!this.data.qrcode) {
            app.util.message('获取二维码失败', 'error')
            return
        }
        wx.downloadFile({
            url: this.data.qrcode,
            success: function(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function() {
                        app.util.message('已保存到相册')
                    },
                    fail: function(res) {
                        console.log('error', res)
                        app.util.message('保存失败，请检查是否有保存到相册权限', 'error')
                    }
                })
            },
            fail: function() {
                app.util.message('图片下载失败', 'error')
            }
        })
    }
})