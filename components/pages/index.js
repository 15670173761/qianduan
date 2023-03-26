Component({
    properties: {
        page: {
            type: Number,
            value: 0
        },
        pagesize: {
            type: Number
        },
        count: {
            type: Number
        }
    },
    observers: {
        'count, pagesize': function(count, pagesize) {
          this.setData({
            pageMax: Math.ceil(this.data.count / this.data.pagesize)
          })
        }
    },
    data: {
        pageMax: 1,
        pageInput: '',
        showPageInput: false
    },
    methods: {
        doPageChange() {
            this.triggerEvent('change', this.data.pageInput)
            this.closePageInput()
        },
        doPrev() {
            if(this.data.page > 1) {
                this.triggerEvent('change', this.data.page - 1)
            }
        },
        doNext() {
            if(this.data.page < this.data.pageMax) {
                this.triggerEvent('change', this.data.page + 1)
            }
        },
        showPageInput() {
            this.setData({
                pageInput: this.data.page,
                showPageInput: true
            })
        },
        closePageInput() {
            this.setData({
                showPageInput: false
            })
        }
    }
})
