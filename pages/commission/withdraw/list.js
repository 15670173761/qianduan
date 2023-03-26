const app = getApp()
Page({
    data: {
        list: [],
        noMore: 0,
        page: 1
    },
    onLoad(options) {
        this.getList();
    },
    
    onReachBottom: function() {
        this.getList();
    },
    onPullDownRefresh: function() {
        this.setData({
            page: 1,
            list: []
        })
        this.getList();
        setTimeout(() => {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        }, 500)
    },
    getList() {
        let page = this.data.page;
        app.util.request({
            url: 'commission/withdrawList',
            data: {
                page: page
            }
        }).then((res) => {
            if (res.data.length > 0) {
                this.setData({
                    list: this.data.list.concat(res.data),
                    noMore: 0,
                    page: page + 1
                })
            } else {
                this.setData({
                    noMore: 1
                })
            }
        })
    }
})