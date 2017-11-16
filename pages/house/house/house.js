// //获取应用实例
var app = getApp()

//最大拖拽距离
var dragright = 150;
//touchstart点
var startX = 0,startY = 0;
//touchmove差值
var distanceX = 0,distanceY = 0;
//touchstart指向的item的index
var index = 0;
//记录touchmove的方向
var dir = "";
Page({
    data:{
        area:{
          lt:'面积 < 100 ㎡',
          gt:'面积 > 100 ㎡'
        },
        navTitle:'',
        arrList : [],
        prodItemHeight:200,
        searchHeight:110,
        orderFilterHeight:80,
        scrollHeight:1000,
        searchByFilter:false,
        searchByOrder:false,
        
        distanceShow:false,
        searchName:'',
        jd:'',//经度
        wd:'',//纬度
        jl:'',//距离
        mj: ''//面积
    },
    searchName: function (e) {
      this.setData({
        searchName: e.detail.value
      })
    },
    onLoad: function (options) {
      this.getLocation();
         
    },
    onReady : function(){
        this.setScrollHeight();
        const _that = this;
    },
    // 按顺序搜索
    searchByOrder:function(){
        this.setData({
            searchByOrder:!this.data.searchByOrder,
            searchByFilter:false
        }) 
    },
    // 按过滤搜索
    searchByFilter:function(){
        this.setData({
            searchByOrder:false,
            searchByFilter:!this.data.searchByFilter
        })
    },
    confirmFilter:function(){
        this.setData({
            searchByOrder:false,
            searchByFilter:false
        })
    },
    //获取经纬度
    getLocation: function (e) {
      var _this = this
      wx.getLocation({
        success: function (res) {
          _this.setData({
            jd: res.longitude,
            wd: res.latitude
          })
          _this.getApiData();   
        }
      })
    },
    //编辑服务
    editProdSvr:function(e){
        var id = e.currentTarget.id
        wx.navigateTo({
          url: '../bmap/bmap?id=' + id,
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
    search:function(){
      const _this = this;
      _this.getApiData();
    },
    searchDistance:function (e){
      const _this = this;
      var flag = e.currentTarget.dataset.distance;
      console.log(1,flag)
      if(flag != ''){
        _this.setData({
          jl: flag,
          searchByOrder: !this.data.searchByOrder,
          searchByFilter: false,
          distanceShow: !this.data.distanceShow
        })
        _this.getApiData();
      }
    }, 
    searchAreaLt: function (e) {
      const _this = this;
      var flag = e.currentTarget.dataset.area;
      console.log(1, flag)
      if (flag != '') {
        _this.setData({
          mj: flag,
          searchByFilter: !this.data.searchByFilter, 
          searchByOrder: false,
          areaLt: !this.data.areaLt,
          areaGt: false
        })
        _this.getApiData();
      }
    },
    searchAreaGt: function (e) {
      const _this = this;
      var flag = e.currentTarget.dataset.area;
      console.log(1, flag)
      if (flag != '') {
        _this.setData({
          mj: flag,
          searchByFilter: !this.data.searchByFilter,
          searchByOrder: false,
          areaGt: !this.data.areaGt,
          areaLt:false
        })
        _this.getApiData();
      }
    },
    // 设置混动区域高度
    setScrollHeight:function(){
        const _this = this;
        const searchHeight = _this.data.searchHeight;
        const orderFilterHeight = _this.data.orderFilterHeight;
        const leftHeight = searchHeight*1 + orderFilterHeight;
        wx.getSystemInfo({
        success: function(res) {
            const scrollHeight = res.windowHeight-(leftHeight/res.pixelRatio).toFixed(2) ;
            _this.setData({
                scrollHeight:scrollHeight,
                    scrollHeight:scrollHeight
                })
            }
        })
    },
    getApiData: function () {
      const _this = this;
      var searchName = _this.data.searchName;      
      wx.request({
        url: 'https://www.njshanglv.com/wx/wx/searchFyxx',
        data: {
          token: wx.getStorageSync("id_token"),
          name: searchName,
          jd: _this.data.jd,
          wd: _this.data.wd,
          jl: _this.data.jl,
          mj: _this.data.mj
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.data)
          wx.showToast({
            icon: "loading",
            title: "正在加载"
          })
          if (res.data.code === 0){
            setTimeout(function () {
              _this.setData({
                arrList: res.data.data,
                response: res
              })
              wx.hideToast() 
            }, 1000)          
          }          
        }
      })
    }
    
})


