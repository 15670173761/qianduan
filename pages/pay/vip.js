const util = require("../../utils/util");

const app = getApp();
var rewardVideoAd = null;
Page({
    data: {
        pageIsLoad: false,
        is_check: -1,
        is_ios_pay: 0,
        system: '',
        vip_expire_time: '',
        vipList: [],
        vip_id: 0,
        paying: false
    },

    onLoad: function (options) {
        this.setData({
            system: app.globalData.system
        })
        app.util.checkLogin().then(() => {
            this.getWxappInfo()
            this.getVipList()
            this.setData({
                pageIsLoad: true
            })
        })
    },

    onShow() {
        if(this.data.pageIsLoad) {
            this.getBalance()
        }
    },

    getVipList() {
        app.util.request({
            url: '/wxapp/getVipList'
        }).then(res => {
            const vipList = res.data
            vipList.forEach(item => {
                if(item.is_default) {
                    this.setData({
                        vip_id: item.id
                    })
                }
            })
            this.setData({
                vipList: vipList
            })
        })
    },
    
    getBalance() {
        app.util.request({
            url: '/wxapp/getBalance',
            loading: false
        }).then(res => {
            this.setData({
                balance: res.data.balance,
                vip_expire_time: res.data.vip_expire_time
            })
        })
    },

    chooseVip(e) {
        const id = e.currentTarget.dataset.id
        this.setData({
            vip_id: id
        })
    },
    
    getWxappInfo() {
        const _this = this
        app.util.request({
            url: '/wxapp/getWxappInfo',
            loading: false
        }).then(res => {
            _this.setData({
                is_check: res.data.is_check,
                is_ios_pay: res.data.is_ios_pay
            })
        })
    },

    doPayVip: function () {
		if (this.data.paying) {
			return false;
        }
        var vip_id = this.data.vip_id;

        if (vip_id == 0) {
            app.util.message('请选择VIP套餐');
            return false;
        }

        this.setData({
            paying: true
        })

        setTimeout(() => {
            this.setData({
                paying: false
            }, 2000)
        })

        app.util.request({
            url: '/wxapp/createOrder',
            data: {
                vip_id: vip_id
            }
        }).then(res => {
            wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: 'MD5',
                paySign: res.data.paySign,
                success: function (res) {
                    app.util.message('支付成功', 'error', function() {
                        wx.redirectTo({
                           url: '/pages/index/index',
                        })
                    })
                },
                fail: function (res) {
                    app.util.message('支付失败，请重试', 'error');
                }
            })
        })
    }
})