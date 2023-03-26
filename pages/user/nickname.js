const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()
Page({
    data: {
        avatar: defaultAvatarUrl,
        nickname: ''
    },
    onChooseAvatar(e) {
        this.setData({
            avatar: e.detail.avatarUrl
        })
    },
    onChooseAvatar(e) {
        this.setData({
            avatar: e.detail.avatarUrl
        })
    },
    saveUserInfo() {
        var avatar = this.data.avatar
        var nickname = this.data.nickname
        if (!nickname || nickname == '微信用户') {
            app.util.message('请设置昵称', 'error')
            return
        }
        if (!avatar || avatar == defaultAvatarUrl) {
            app.util.message('请设置头像', 'error')
            return
        }
        app.util.upload({
            url: '/upload/image',
            filePath: avatar
        }).then(res => {
            avatar = res.data.path
            app.util.request({
                url: '/user/setUserInfo',
                data: {
                    avatar: avatar,
                    nickname: nickname
                }
            }).then(res => {
                wx.navigateBack()
            })
        })
        
    }
})