const app = getApp()
Page({
    data: {
        member: {},
        commission: {}
    },
    onShow() {
        this.getData();
    },
    getData() {
        app.util.request({
            url: '/commission/index'
        }).then((res) => {
            if (!res.data) {
                wx.redirectTo({
                    url: '/pages/commission/apply'
                });
                return;
            }
            this.setData({
                member: res.data.member,
                commission: res.data.commission
            })
        })
    },
    toWithdraw() {
        let commission = this.data.commission;
        if(!commission || !commission.money) {
            app.util.message('暂无可提现佣金');
            return;
        }
        wx.navigateTo({
            url: '/pages/commission/withdraw/index?money=' + commission.money
        })
    },
    onPullDownRefresh() {
		this.getData();
		setTimeout(() => {
			wx.hideNavigationBarLoading(); //完成停止加载
			wx.stopPullDownRefresh(); //停止下拉刷新
		}, 500);
    },
    toShare() {
        app.util.message('请回到首页，点右上角“...”，转发给朋友', 'error', function() {
            wx.switchTab({
                url: '/pages/index/index',
                fail() {
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
            })
        })
    }
})