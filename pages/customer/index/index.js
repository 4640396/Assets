// //获取应用实例
var app = getApp()

//最大拖拽距离
var dragright = 150;
//touchstart点
var startX = 0, startY = 0;
//touchmove差值
var distanceX = 0, distanceY = 0;
//touchstart指向的item的index
var index = 0;
//记录touchmove的方向
var dir = "";
Page({
  data: {
    navTitle: '',
    arrList: [],
    prodItemHeight: 200,
    searchHeight: 110,
    orderFilterHeight: 80,
    scrollHeight: 1000,
    searchByFilter: false,
    searchByOrder: false,

    searchName: ''
  },
  searchName: function (e) {
    this.setData({
      searchName: e.detail.value
    })
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    this.setScrollHeight();
    const _that = this;    
  },
  onShow: function () {
    this.getApiData();
  },
  // 按顺序搜索
  searchByOrder: function () {
    this.setData({
      searchByOrder: !this.data.searchByOrder,
      searchByFilter: false
    })
  },
  // 按过滤搜索
  searchByFilter: function () {
    this.setData({
      searchByOrder: false,
      searchByFilter: !this.data.searchByFilter
    })
  },
  confirmFilter: function () {
    this.setData({
      searchByOrder: false,
      searchByFilter: false
    })
  },
  //编辑服务
  editProdSvr: function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../list/list?id=' + id,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //搜索
  search: function () {
    const _this = this;
    var searchName = _this.data.searchName;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/searchKhfw',
      data: {
        token: wx.getStorageSync("id_token"),
        name: searchName
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
    const orderFilterHeight = _this.data.orderFilterHeight;
    const leftHeight = searchHeight * 1 + orderFilterHeight;
    wx.getSystemInfo({
      success: function (res) {
        const scrollHeight = res.windowHeight - (leftHeight / res.pixelRatio).toFixed(2);
        _this.setData({
          scrollHeight: scrollHeight,
          scrollHeight: scrollHeight
        })
      }
    })
  },
  getApiData: function () {
    const _this = this;
    console.log(2,'xxxxx')
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/searchKhfw',
      data: {
        token: wx.getStorageSync("id_token"),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        _this.setData({
          arrList: res.data.data,
          response: res
        })
      }
    })
  },
  //添加服务
  addProdSvr: function () {
    wx.navigateTo({
      url: '../add/add',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }

})


