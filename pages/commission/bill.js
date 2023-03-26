const app = getApp()
Page({
    data: {
        list: [],
        noMore: 0,
        page: 1,
        type: 'all'
    },
    onLoad: function(options) {
    	if (options.type) {
    		this.setData({
    			type: options.type
    		})
    	}
    	this.getList();
    },
    onReachBottom: function() {
    	this.getList();
    },
    onPullDownRefresh: function() {
    	this.refreshList();
    	setTimeout(() => {
    		wx.hideNavigationBarLoading();
    		wx.stopPullDownRefresh();
    	}, 500);
    },
    getList() {
        let page = this.data.page;
        app.util.request({
            url: '/commission/billList',
            data: {
                type: this.data.type,
                page: page
            }
        }).then((res) => {
            if (res.data.length > 0) {
                this.setData({
                    list: this.data.list.concat(res.data),
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
    switchTab: function(e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            type: type
        });
        this.refreshList();
    },
    refreshList: function() {
        this.setData({
            page: 1,
            list: []
        });
        this.getList();
    }
})