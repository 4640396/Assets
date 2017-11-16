//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    //获取openid  
    var user = wx.getStorageSync('user') || {};
    if (this.globalData.userInfo || user.openid){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (e) {
          var d = that.globalData.wxData;//这里存储了appid、secret、token串  
          var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appId + '&secret=' + d.appSecret+'&js_code='+e.code+'&grant_type=authorization_code';
          wx.request({
            url: l,
            data: {},
            method: 'GET', 
            // header: {}, // 设置请求的 header  
            success: function (res) {
              var obj = {};
              obj.openid = res.data.openid;
              obj.expires_in = Date.now() + res.data.expires_in;
              wx.setStorageSync('user', obj);//存储openid  
            }
          });
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          });
        }
      })
    }
    
  },
  globalData:{
    userInfo:null,
    wxData:{
      appId: 'wx52cd9b4215a6bde7',
      appSecret: '21b0e6292e742fbb6b3854095b8d644b',
      token: 'u-TKkoBtXFTFuC-W4SGJvO2dL3YWSljvT4TZqmSX1sOymgjrzv1hTe82_ZIYSkKl_10hV3FQSLeZAUUBqE9KRtxQvB3ASEK2K6vFc2ZVv1jVtXxZ3M1pLDXNPA-fwscpZWUhADAEBZ' 
    }
  }
})