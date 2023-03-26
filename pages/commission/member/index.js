
const app = getApp()
Page({
    data: {
        list: [],
        page: 1,
        noMore: 0
    },

    onLoad() {
        this.getList();
    },
    onReachBottom() {
        this.getList();
    },
    onPullDownRefresh() {
        this.setData({
			page: 1,
			list: [],
			noMore: 0
		})
		this.getList();
    },
    getList() {
        let page = this.data.page;
        app.util.request({
            url: '/commission/memberList',
            page: page
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
    }
})