Page({
  data: {
    inputDisabled:true,      //input 是否可输入
    arrList: []
  },
  onLoad: function (options) {
    this.setArrList(options.id);
  }, 
  onShow: function () {
    
  },
  setArrList: function (id) {
    const _this = this;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getAZjsj',
      data: {
        token: wx.getStorageSync("id_token"),
        id:id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(1,res.data.data)
        _this.setData({
          arrList: res.data.data
        })
      }
    })
  },

    
})
