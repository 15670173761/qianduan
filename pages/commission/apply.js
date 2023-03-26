const app = getApp()
Page({
    data: {
        name: '',
        phone: '',
        is_agree: false,
        pid: 0,
        focus: '',
        lastApply: null,
        isEdit: false
    },

    onLoad(options) {
        if(options.scene) {
            let scene = decodeURIComponent(options.scene)
            let param = app.util.queryToArr(scene)
            if(param.pid) {
                this.setData({
                    pid: param.pid
                })
            }
        }
        let phone = wx.getStorageSync('phone');
        if (phone) {
            this.setData({
                phone: phone
            })
        }
        this.getLastApply();
    },
    doSubmit: function() {
        const _this = this;
        let name = this.data.name;
        let phone = this.data.phone;
        let pid = this.data.pid;
        let is_agree = this.data.is_agree;
        if (!name) {
            app.util.message('请输入姓名', 'error');
            return
        }
        if (!phone) {
            app.util.message('请输入手机号', 'error');
            return
        }
        if (!is_agree) {
            app.util.message('请阅读并同意《用户分销协议》', 'error');
            this.setData({
                is_agree: true
            })
            return
        }
        app.util.request({
            url: '/commission/apply',
            data: {
                name: name,
                phone: phone,
                pid: pid
            }
        }).then((res) => {
            wx.showModal({
                title: '系统提示',
                content: res.message,
                showCancel: false,
                success() {
                    _this.setData({
                        lastApply: null,
                        isEdit: false
                    })
                    _this.getLastApply();
                }
            })
        })
    },

    toAgreement() {
        wx.navigateTo({
            url: '/pages/commission/agreement'
        })
    },

    toCommission() {
        wx.redirectTo({
            url: '/pages/commission/index'
        })
    },

    toEdit() {
        this.setData({
            isEdit: true
        })
    },

    getLastApply() {
        app.util.request({
            url: '/commission/getLastApply'
        }).then((res) => {
            if (res.data) {
                this.setData({
                    lastApply: res.data,
                    name: res.data.name,
                    phone: res.data.phone
                })
            }
        })
    },

    inputChange(e) {
        let name = e.currentTarget.dataset.name;
        let value = e.detail.value;
        this.setData({
            [name]: value
        });
    },

    inputFocus(e) {
        let name = e.currentTarget.dataset.name;
        this.setData({
            focus: name
        });
    },

    inputBlur(e) {
        let name = e.currentTarget.dataset.name;
        if (this.focus == name) {
            this.setData({
                focus: ''
            });
        }
    },

    checkboxChange(e) {
        let value = e.detail.value
        this.setData({
            is_agree: value.length > 0
        });
    }
})