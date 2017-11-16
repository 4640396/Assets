//获取应用实例
var bmap = require('../../../libs/bmap-wx.min.js');
var wxMarkerData = [];

var app = getApp()
Page({
  data: {
      markers: [],
      rgcData: {}, 
      showImgs:false,
      showMap: false,  //是否显示地图
      showXmmc: false,  //是否显示项目名称
      showDymc: false, //是否显示单元名称
      showTxtXm: false,  //是否显示项目名称text标签
      showTxtDy: false,   //是否显示单元名称text标签
      showTxtMap: false,   //是否显示地图text标签

      disabledPickerDy:false,
      disabledPickerXm:false,

      tempFilePaths:'',
      imgList:'',
      arrList:[],
      xmmcArr:[],
      xmmcIdx: 0,
      xmmc:'',
      xmmcId: '',
      

      dymcArr: [],
      dymcIdx: 0,
      dymc: '',
      dymcId: '',


      //明细
      dymc:'',
      scwj:'',
      fwnr:'',
      jwd:''
  },  
  onLoad: function (options) {
    const _this = this;
    _this.setDymcArr();
    if (options.id == ""){
      _this.setDymcArr();
    }else{
      _this.getKhfwData(options.id);
    }   
    _this.setData({
      id: options.id
    })
  },
  getKhfwData :function (id) {
    const _this = this;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getAKhfw',
      data: {
        token: wx.getStorageSync("id_token"),
        id: id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var e = res.data;
        var arr = e.data[0].scwj.substr(1).split("|");
        var tempArr = [];
        for (var index in arr) {
          tempArr.push('https://www.njshanglv.com'+arr[index]);
        }
        if (e.code === 0) {
          _this.getApiData(res.data.data[0].jwd);
          _this.setData({
            xmmc: e.data[0].xmmc,
            dymc: e.data[0].dymc,
            fwnr: e.data[0].fwnr,
            tempFilePaths: tempArr
          })
        }
      }
    })
  },
  getApiData: function (jwd) {
    const _this = this;
    var e = {
      ak:"vuRGkGraxG4p45j1pnC92yjxoD92xpqj",
      output:"json",
      location:jwd
    }
    var latitude = jwd.split(",")[0];  //纬度
    var longitude = jwd.split(",")[1]; //经度
    wx.request({
      url: "https://api.map.baidu.com/geocoder/v2/",
      data: e,
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (a) {
        var e = a.data;
        if (0 === e.status) {
          var n = e.result
          var wxMarkerData = [];
          wxMarkerData[0] = {
            id: 0,
            latitude: latitude,
            longitude: longitude,
            address: n.formatted_address,
            iconPath: '../../../image/common/bmap/marker_red.png',
            iconTapPath: '../../../image/common/bmap/marker_red.png',
            desc: n.sematic_description,
            business: n.business
          };
          _this.setData({
            markers: wxMarkerData,
            latitude: latitude,
            longitude: longitude,
            locationAddress: n.formatted_address
          })
        } 
      },
      fail: function (t) {
        i.fail(t)
      }
    })
  },
   //选择照片
  choicePic:function(){
    const _this = this;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var imgListTemp = [];
        for (var index in tempFilePaths) {          
          _this.upload_file(tempFilePaths[index], imgListTemp)
        }        
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片       
        _this.setData({
          tempFilePaths:tempFilePaths,
          showImgs:true
        })
      }
    })
  },
  upload_file: function (filePath, imgListTemp) {
    var _this = this;
    var fileName = filePath.split('//')[1];
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: "https://www.njshanglv.com/wx/wx/uploadPic",
      filePath: filePath,
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        fileName: fileName
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        } else {
          var data = res.data;
          var obj = JSON.parse(data);          
          imgListTemp.push(obj.data[0].path);
          _this.setData({
            imgList: imgListTemp
          }); 
        }        
      },
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
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
  setXmmcArr: function () {
    const _this = this;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getXmmc',
      data: {
        token: wx.getStorageSync("id_token"),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.setData({
          xmmcArr: res.data.data,
          showXmmc: true
        })
        if (_this.data.xmmcArr.length == 0) {
          _this.setData({
            disabledPickerXm: true
          })
        }
      }
    })    
  },
  setDymcArr: function () {
    const _this = this;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getDymc',
      data: {
        token: wx.getStorageSync("id_token"),
        //id: xmmcArr[index].id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.setData({
          dymcId: '',
          dymcArr: res.data.data,
          disabledPickerDy: false
        })
      }
    })
  },
  bindPickerXmmc: function (e) {
    const _this = this;
    var index = e.detail.value;
    let xmmcArr = this.data.xmmcArr;
    this.setData({
      xmmcId: xmmcArr[index].id,
      xmmcIdx: e.detail.value,
      showTxtXm: true,
      showTxtDy:false
    })
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getDymc',
      data: {
        token: wx.getStorageSync("id_token"),
        id: xmmcArr[index].id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.setData({
          dymcId:'',
          dymcArr: res.data.data,
          disabledPickerDy:false
        })
      }
    })
  },
  bindPickerDymc: function (e) {
    console.log(1,1)
    const _this = this;
    var index = e.detail.value;
    let dymcArr = this.data.dymcArr;
    this.setData({
      dymcId: dymcArr[index].id,
      dymcIdx: e.detail.value,
      showTxtDy: true
    })
  },
  chooseDymc: function () {
    const _this = this;
    var xmmcId = _this.data.xmmcId;
    if (xmmcId == ""){
      wx.showModal({
        title: '提示',
        content: '请先选择项目名称！',
        showCancel: false
      })
    }
  },
  bindFwnr: function (e) {
    this.setData({
      fwnr: e.detail.value
    })
  },
  save: function () {
    const _this = this;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/saveKhfw',
      method: "POST", 
      data: {
        token: wx.getStorageSync("id_token"),
        id: _this.data.id,
        xmmc: _this.data.xmmcId,
        dymc: _this.data.dymcId,
        fwnr: _this.data.fwnr,
        jwd: _this.data.jwd,
        zt:'1',
        sctp: _this.data.imgList
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == "0"){
          wx.showModal({
            title: '提示',
            content: '修改成功',
            showCancel: false
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '修改失败',
            showCancel: false
          })
        }        
      }
    })
  }

})
