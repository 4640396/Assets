//login.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userData:'',
    passwordData:'',
    indicatorDots: false,
    autoplay: true,
    interval: 3500,
    duration: 1500,
    circular: true,
    mode: 'aspectFill',
    imgUrls: ['./images/banner1.jpg', './images/banner2.jpg', './images/banner3.jpg', './images/banner4.jpg', './images/banner5.jpg', './images/banner6.gif']
  },
  //事件处理函数
  userInput: function(e){
    this.setData({
        userData: e.detail.value
    })
  },
  passwordInput: function(e){
    this.setData({
      passwordData: e.detail.value
    })
  },
 login: function(){
   var that = this
   var userName = this.data.userData;
   var userPassword = this.data.passwordData;
   wx.request({
      url:'https://www.njshanglv.com/wx/wx/mylogin',
      data:{
        username: userName,
        password: userPassword,
      },
      method:'GET',
      success: function(res){     
        if(res.data.code == 0){
            var arr = res.data.data;  
            for(var i in arr){  
              var token = arr[i].token;
            } 
            that.setData({
              id_token: token,
              response: res
            })
            try {
              wx.setStorageSync('id_token', token)
              wx.setStorageSync('userName', userName);
              wx.setStorageSync('userPassword', userPassword);
            } catch (e) {
            }
            wx.redirectTo({
              //url: '../house/index/index'
              url: '../home/home'
            })
            console.log(res.data);  
        }else{
          // wx.showToast({
          //   title: res.data.message,
          //   icon: 'success',
          //   duration: 2000
          // })
          wx.showModal({
            title: '错误信息',
            content: '用户名或密码错误！',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
        
      },
      fail:function(){        
        console.log(res.data);
        console.log('is failed')  
      }

   })   
 },

  onLoad: function () {
    var that = this    
    var userName = wx.getStorageSync('userName');
    var userPassword = wx.getStorageSync('userPassword');
    if (userName) {
      that.setData({ userData: userName });
    }
    if (userPassword) {
      that.setData({ passwordData: userPassword });
    }
    //调用应用实例的方法获取全局数据
  //  app.getUserInfo(function(userInfo){
      //更新数据
  //    that.setData({
  //      userInfo:userInfo
  //    })
  //  })
  }
})
