const app = getApp()
Page({

    data: {
        is_check: 1,
        money: 0,
        bank_name: '',
        account_name: '',
        account_number: '',
        imgList: [],
        word_zfb: '',
        word_weixin: '',
        word_lingqian: ''
    },
    onLoad(options) {
        this.setData({
            money: options.money,
            bank_name: decodeURIComponent('%E5%BE%AE%E4%BF%A1%E9%9B%B6%E9%92%B1'),
            word_zfb: decodeURIComponent('%E6%94%AF%E4%BB%98%E5%AE%9D'),
            word_lingqian: decodeURIComponent('%E5%BE%AE%E4%BF%A1%E9%9B%B6%E9%92%B1'),
            word_weixin: decodeURIComponent('%E5%BE%AE%E4%BF%A1'),
            word_skm: decodeURIComponent('%E6%94%B6%E6%AC%BE%E7%A0%81')
        });
        this.getWxappInfo();
        this.geLastWithdraw();
    },

    geLastWithdraw: function () {
        app.util.request({
            url: '/commission/lastWithdraw'
        }).then((res) => {
            if (res.data.bank_name) {
                this.setData({
                    bank_name: res.data.bank_name
                });
            }

            if (res.data.account_name) {
                this.setData({
                    account_name: res.data.account_name
                });
            }

            if (res.data.account_number) {
                this.setData({
                    account_number: res.data.account_number
                });
            }
        });
    },

    getWxappInfo() {
        const _this = this
        app.util.request({
            url: '/wxapp/getWxappInfo',
            loading: false
        }).then(res => {
            if (res.data.is_check === 0) {
                wx.setNavigationBarTitle({
                  title: '佣金提现'
                })
            }
            _this.setData({
                is_check: res.data.is_check
            })
        })
    },

    bankChange: function (e) {
        let type = e.currentTarget.dataset.type
        if(type != this.data.word_lingqian && type != this.data.word_zfb) {
            type = ''
        }
        this.setData({
            bank_name: type
        });
    },

    inputChange: function (e) {
        const name = e.currentTarget.dataset.name;
        this.setData({
            [name]: e.detail.value
        })
    },

    withdraw: function () {
        let money = this.data.money
        let bank_name = this.data.bank_name
        let account_name = this.data.account_name
        let account_number = this.data.account_number
        let imgList = this.data.imgList
        let data = {}
        if(bank_name == this.data.word_lingqian) {
            if (!account_name) {
                app.util.message('请输入户名', 'error')
                return
            }
            if (!imgList || imgList.length == 0) {
                app.util.message('请上传' + this.data.word_skm, 'error')
                return
            }
            data = {
                money: money,
                bank_name: bank_name,
                account_name: account_name,
                qrcode: imgList[0]
            }
        } else if (bank_name == this.data.word_zfb) {
            if (!account_name) {
                app.util.message('请输入户名', 'error')
                return
            }
            if (!account_number) {
                app.util.message('请输入' + this.data.word_zfb + '账号', 'error')
                return
            }
            data = {
                money: money,
                bank_name: bank_name,
                account_name: account_name,
                account_number: account_number
            }
        }
        app.util.request({
            url: '/commission/withdraw',
            data: data
        }).then((res) => {
            wx.showModal({
                title: '系统提示',
                content: res.message,
                showCancel: false,
                success() {
                    wx.navigateBack({
                        fail() {
                            wx.redirectTo({
                                url: '/pages/commission/index'
                            })
                        }
                    })
                }
            })
        })
    },
    chooseImage() {
        const _this = this
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            sizeType: ['original', 'compressed'],
            success: (res) => {
                const tempFiles = res.tempFiles
                console.log('res', res)
                app.util.upload({
                    url: '/upload/image',
                    filePath: tempFiles[0]['tempFilePath'],
                    name: 'image'
                }).then(res => {
                    var imgList = _this.data.imgList
                    imgList.push(res.data.path)
                    _this.setData({
                        imgList: imgList
                    })
                })
            }
        });
    },
    viewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    delImg(e) {
        wx.showModal({
            title: '请确认',
            content: '确定要删除这张图片吗？',
            cancelText: '取消',
            confirmText: '确定删除',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })
    }
})