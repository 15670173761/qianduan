const app = getApp();
Page({

    data: {
        type: '故障',
        content: '',
        phone: ''
    },
    onLoad() {

    },
    typeChange(e) {
        this.setData({
            type: e.detail.value
        })
    },
    doSubmit() {
        const type = this.data.type;
        const content = this.data.content;
        const phone = this.data.phone;
        if(content === '') {
            app.util.message('请输入反馈内容', 'error')
            return
        }
        app.util.request({
            url: '/user/feedback',
            data: {
                type: type,
                content: content,
                phone: phone
            }
        }).then(res => {
            app.util.message(res.message, 'error', function() {
                wx.navigateBack()
            })
        })
    }
})