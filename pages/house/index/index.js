//homepage.js
//获取应用实例
var arrList = require('../../../api/fangyuan/shop.js');
var menuList = require('../../../image/home/index/menuList.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 房源
    scrollHeight: '600',
    scrollHeightMine: '600',
    scrollTop: 0,
    scrollTopMine: 0,
    refreshTop: 50,
    arrList: arrList,
    menuList: menuList,
    refresh: false,
    showMask: false,
    
    // 公共
    tabbarAct: 'shop',
    refreshText: '下拉刷新...',
    searchHeight: '220',
    noticeHeight: 65,
    hasMore: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    imgUrls: ['', ''],
    tabbarHeight: 0
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log(123456780987654)
    // const that = this;
    // setTimeout(function(){
    //   wx.stopPullDownRefresh();
    //   that.setData({
    //     showMask:true
    //   })
    // },200)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // wx.redirectTo({
    //   url: '../guide/guide',
    //   success: function(res){
    //     // success
    //   },
    //   fail: function() {
    //     // fail
    //   },
    //   complete: function() {
    //     // complete
    //     console.log('redirectTo')
    //   }
    // })
    const _this = this;
    // wx.showNavigationBarLoading()
    this.setScrollHeight();
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      _this.setData({
        userInfo: userInfo
      })
    })
    this.getApiData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //距离或会否开张选择
  tapSlideItem: function (e) {
    console.log(1, e.currentTarget.dataset.itemcon);
    const content = e.currentTarget.dataset.itemcon;
    this.setData({
      itemcon: content
    });
  },
  //
  checkChoiceList: function () {
    console.log('checkChoiceList');
    let showChoiceList = false;
    if (this.data.showChoiceList == false) {
      showChoiceList = true;
    } else {
      showChoiceList = false;
    }
    this.setData({
      showChoiceList: showChoiceList
    });
    return showChoiceList;
  },
  closeChoiceList: function () {
    if (this.data.showChoiceList == true) {
      this.setData({
        showChoiceList: false,
        lastClickDisOrStatus: ''
      });
    }
  },
  houseDetail: function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../bmap/bmap?id='+id,
      success: function (res) {
        // success
        console.info('res',res)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  // aboutUs:function(){
  //   wx.navigateTo({
  //     url: '../../common/about-us/about-us',
  //     success: function(res){
  //       // success
  //     },
  //     fail: function() {
  //       // fail
  //     },
  //     complete: function() {
  //       // complete
  //     }
  //   })
  // },




  // touchStart:function(){
  //   this.setData({
  //     showMask:false
  //   })
  // },
  // touchEnd:function(){
  //   console.log('touchEnd')
  // },
  toUpper: function (e) {
    this.onPullDownRefresh();

  },


  toLower: function (e) {
    console.log(2, e)
    // wx.showToast({
    //   title:'加载中...',
    //   icon:'loading',
    //   duration:2000
    // })
  },
  scroll: function (e) {
    console.log(e)
    const _this = this;
    let timer1 = null;
    let timer2 = null;
    const scrollTop = e.detail.scrollTop;
    const refreshTop = _this.data.refreshTop;
    console.log('scrollTop:', scrollTop);
    console.log('refreshTop', refreshTop);

    if (scrollTop > refreshTop * 0.2 && scrollTop <= refreshTop) {
      timer1 = setTimeout(function () {
        _this.setData({
          scrollTop: _this.data.refreshTop,
          refreshText: '下拉刷新...'
        })
      }, 150000);
    } else if (scrollTop <= refreshTop * 0.2) {
      console.log('释放刷新');
      _this.onPullDownRefresh();
      _this.setData({
        refreshText: '释放刷新...'
      })
      timer2 = setTimeout(function () {
        _this.setData({
          scrollTop: refreshTop
        })
      }, 400000);
    } else {
      _this.setData({
        scrollTop: scrollTop,
        refreshText: '下拉刷新...'
      })
    }
  },

  getApiData: function () {
    const _this = this;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getFyxx',
      data: {
        token: wx.getStorageSync("id_token"),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.setData({
          arrList: res.data.data,
          response: res
        })
      }
    })
  },

  // 设置混动区域高度
  setScrollHeight: function () {
    const _this = this;
    const searchHeight = _this.data.searchHeight;
    const noticeHeight = _this.data.noticeHeight
    const tabbarHeight = _this.data.tabbarHeight;
    let scrollHeight = _this.data.scrollHeight
    const leftHeight = searchHeight * 1 + noticeHeight + tabbarHeight;
    wx.getSystemInfo({
      success: function (res) {
        scrollHeight = res.windowHeight - (leftHeight / res.pixelRatio).toFixed(2);
        const scrollHeightMine = res.windowHeight - (tabbarHeight / res.pixelRatio).toFixed(2);
        _this.setData({
          scrollHeight: scrollHeight,
          scrollHeightMine: scrollHeightMine
        })
      }
    })
  }
})
