const app = getApp()
Page({
    data: {
        qrcode: '',
        posterList: [],
        current: 0
    },
    onLoad(options) {
        this.getPoster()
    },

    getPoster: function() {
        app.util.request({
            url: '/commission/poster'
        }).then(res => {
            this.setData({
                qrcode: res.data.qrcode,
                posterList: res.data.posterList
            })
        })
    },
    swiperChange: function(e) {
        this.setData({
            current: e.detail.current
        })
    },
    saveImage: function() {
        var context = wx.createCanvasContext('poster')
        var poster = this.posterList[this.current]
        var qrcode = this.qrcode
        var posterOk = false
        var qrcodeOk = false
        wx.showLoading({
            title: '生成中'
        })
        wx.downloadFile({
            url: poster.img,
            success: function(res) {
                context.drawImage(res.tempFilePath, 0, 0, 500, 750)
                posterOk = true;
                wx.downloadFile({
                    url: qrcode,
                    success: function(res) {
                        context.drawImage(res.tempFilePath, poster.hole.x, poster.hole.y, poster.hole.w, poster.hole.h)
                        qrcodeOk = true;
                    }
                })
            }
        })
        var si = setInterval(() => {
            if(posterOk && qrcodeOk) {
                clearInterval(si)
                context.draw()
                wx.hideLoading()
                setTimeout(() => {
                    wx.canvasToTempFilePath({
                        canvasId: 'poster',
                        destWidth: 500,
                        destHeight: 750,
                        quality: 1,
                        fileType: 'jpg',
                        success: (res) => {
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success: function() {
                                    util.showSuccessToast('已保存到相册')
                                },
                                fail: function(res) {
                                    console.log('error', res)
                                    util.showErrorToast('保存失败，请检查是否有保存到相册权限')
                                }
                            })
                        }
                    })
                }, 300)
            }
        }, 500)
    }
})