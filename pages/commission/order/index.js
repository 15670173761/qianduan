const app = getApp()
Page({
    data: {
        orderList: [],
        noMore: 0,
        page: 1,
        showStatus: 'all'
    },
    onLoad(options) {
        if (options.status) {
            this.setData({
                showStatus: options.status
            });
        }

        this.getOrderList();
    },
    getOrderList() {
        let page = this.data.page
        let orderList = this.data.orderList
        app.util.request({
            url: '/commission/orderList',
            data: {
                page: page
            }
        }).then((res) => {
            if (res.data.length > 0) {
                this.setData({
                    orderList: orderList.concat(res.data),
                    noMore: 0,
                    page: page + 1
                });
            } else {
                this.setData({
                    noMore: 1
                });
            }
        });
    },
    switchTab: function (e) {
        let showStatus = e.currentTarget.dataset.status;
        this.setData({
            showStatus: showStatus
        });
        this.refreshList();
    },

    refreshList: function () {
        this.setData({
            page: 1,
            orderList: []
        });
        this.getOrderList();
    },
    onPullDownRefresh() {
        this.refreshList();
        setTimeout(() => {
            uni.hideNavigationBarLoading();
            uni.stopPullDownRefresh();
        }, 500);
    },
    onReachBottom() {
        this.getOrderList();
    }
})