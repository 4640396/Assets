Page({
  data: {
    arrList:[],
    inputDisabled: true      //input 是否可输入
  },


  setInputStatus: function (options) {
    console.log(0, options.from)
    let inputDisabled = false;
    if (options.from) {
      if (options.from == 'inspect') {
        inputDisabled = true
      } else {
        inputDisabled = false;
      }
      this.setData({
        inputDisabled: inputDisabled
      })
    }
    console.log(11, inputDisabled)
  },
  onLoad: function (options) {
    const _this = this;    
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getCzf',
      data: {
        id: options.czfId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var e = res.data;
        if (e.code == 1){
          _this.setData({
            arrList: res.data.data
          })
        }        
      }
    })
    console.log(2,_this.data.arrList);
    //this.setInputStatus(options);
  },



})
