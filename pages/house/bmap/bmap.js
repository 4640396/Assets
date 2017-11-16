var bmap = require('../../../libs/bmap-wx.min.js');
var wxMarkerData = [];
Page({
  data: { 
    markers: [],
    latitude: '',
    longitude: '',
    placeData: {},
    searchHeight: '400',
    
    tempFilePaths: ''
  },
  onLoad: function (option) {
    const _this = this;
    _this.getApiData(option.id);
  },
  getApiData: function (id) {
      const _this = this;
      wx.request({
          url: 'https://www.njshanglv.com/wx/wx/getAFyxx',
          data: {
              id:id,
              token: wx.getStorageSync("id_token"),
          },
          header: {
              'content-type': 'application/json'
          },
          success: function (res) {
            var e = res.data;
            var arr = e.data[0].fwpmt.substr(1).split("|");
            var htbs = e.data[0].htbs.split(",");
            var htbhs = e.data[0].htbhs.split(",");
            var tempArr = [];
            for (var index in arr) {
              tempArr.push('https://www.njshanglv.com' + arr[index]);
            }
            var htArr = [];
            for (var index in htbs) {
              var item = {};
              item.htbid = htbs[index];
              item.htbh = htbhs[index];
              htArr.push(item);
            }
            _this.setData({
                arrList: res.data.data,
                response: res,
                tempFilePaths: tempArr,
                ht: htArr
            })
              //调用百度接口
              var BMap = new bmap.BMapWX({
                ak: 'vuRGkGraxG4p45j1pnC92yjxoD92xpqj'
              });
              var fail = function (data) {
                console.log(data)
              };
              var success = function (data) {
                wxMarkerData = data.wxMarkerData;
                _this.setData({
                  markers: wxMarkerData
                });
                _this.setData({
                  latitude: wxMarkerData[0].latitude
                });
                _this.setData({
                  longitude: wxMarkerData[0].longitude
                });
              }
              BMap.geocoding({
                "address": res.data.data[0].dz,
                fail: fail,
                success: success,
                iconPath: '../../../image/common/bmap/marker_red.png',
                iconTapPath: '../../../image/common/bmap/marker_red.png'
              });
          }
      })
  },
  getCzf: function (e) {
    var czfId = e.currentTarget.id
    wx.navigateTo({
      url: '../czf/czf?czfId=' + czfId,
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
  //点击预览图片
  ylimg: function (e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
   editProdSvr: function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../ht/ht?id=' + id,
      success: function (res) {
       
        
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
})