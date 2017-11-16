//homepage.js
//获取应用实例
var arrList = '';
var menuList = require('../../image/home/index/menuList.js');
var wxCharts = require('../../libs/wxcharts.js');
var lineChart = null;
var areaChart = null;
var ringChart = null;
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    duration: 3000,
    imgUrls: ['', ''],
    tabbarHeight: 0,

  },




  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
        // background: '#7cb5ec'
    });
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
        categories.push('2016-' + (i + 1));
        data.push(Math.random()*(20-10)+10);
    }
    // data[4] = null;
    return {
        categories: categories,
        data: data
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const _this = this;
    wx.request({
      url: 'https://www.njshanglv.com/wx/wx/getNotice',
      data: {
        token: wx.getStorageSync("id_token")
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var tempList = [];
        for (var i = 0; i < 2; i++) {
          tempList.push(res.data.data[0]);
        }
        _this.setData({
          imgUrls: tempList,
          response: res
        })
      }
    })
    _this.lineCanvas();
    _this.areaCanvas();
    _this.ringCanvas();
  },
  ringCanvas:function () {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: '70%',
        color: '#7cb5ec',
        fontSize: 25
      },
      subtitle: {
        name: '收益率',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '成交量1',
        data: 15,
        stroke: false
      }, {
        name: '成交量2',
        data: 35,
        stroke: false
      }, {
        name: '成交量3',
        data: 78,
        stroke: false
      }, {
        name: '成交量4',
        data: 63,
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: 200,
      dataLabel: false,
      legend: false,
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);
  },


  areaCanvas:function () {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    areaChart = new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: ['1', '2', '3', '4', '5', '6'],
      animation: true,
      series: [{
        name: '成交量1',
        data: [32, 45, null, 56, 33, 34],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        fontColor: '#8085e9',
        gridColor: '#8085e9',
        titleFontColor: '#f7a35c'
      },
      xAxis: {
        fontColor: '#7cb5ec',
        gridColor: '#7cb5ec'
      },
      extra: {
        legendTextColor: '#cb2431'
      },
      width: windowWidth,
      height: 200
    });
  },
  lineCanvas: function () {
    var windowWidth = 500;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
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
