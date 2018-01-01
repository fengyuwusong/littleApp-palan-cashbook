// pages/addCost/addCost.js
var requestUrl = require('../../requestUrl');
var util = require('../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        time: util.getTime(),
        date: util.getDate(),
        costType: null,
        index: [0, 0],
        detailFlag:false,
        money:0,
        firstType:null,
        secondType:null,
        necessary:null,
        mark:null
    },

    //multiSelector确定事件
    typePickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    //编写列值改变事件
    typePickerColumnChange: function (e) {
        var appData = app.globalData.costType;
        var thisData = this.data.costType;
        var that = this;
        if (e.detail.column == 0) {
            var id = null;
            appData.map(function (item, index, input) {
                id = thisData[0][e.detail.value].fid;
                if (id == item.firstTypeId) {
                    thisData[1] = item.list;
                    that.setData({
                        costType: thisData
                    });
                }
            });
        }
    },

    //日期改变事件
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    //时间改变事件
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },

    //提交按钮事件
    formSubmit: function (event) {
        var cost = {
            money: event.detail.value.money,
            necessary: event.detail.necessary ? 0 : 1,
            mark: event.detail.value.mark,
            createTime: util.dateTimeToTimeStamp(this.data.date + " " + this.data.time+":"+new Date().getSeconds()),
            type: this.data.costType[1][this.data.index[1]].id,
            uid: app.globalData.uid
        }
        //判空 是否为数字
        if (util.isNotEmpty(cost.money, "金额") && util.isNum(cost.money, '金额')) {
            util.showBusy("添加中~");
            util.request(requestUrl.addCost, 'post', cost, 'json', function (res) {
                if(res.data.code==200){
                    util.showSuccess("成功~");
                    //返回上一页面
                    wx.navigateBack({
                        delta: 1
                    })
                }else{
                    util.showModel("错误",res.data.message);
                }
            })
        }
    },

    //查看所有消费类型
    getAllCostType: function () {
        util.showBusy("加载中~");
        var uid = app.globalData.uid;
        var that = this;
        util.request(requestUrl.getAllCostType + uid, 'get', {}, 'json', function (res) {
            var data = res.data.data;
            app.globalData.costType = data;
            that.setData({
                costType: util.costTypeToPicker(data)
            });
            wx.hideToast();
        }, null, null);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.id!==undefined){
            var dateTime=util.spiltDateTime(options.createTime);
            this.setData({
                detailFlag:true,
                date:dateTime[0],
                time:dateTime[1],
                firstType:options.firstType,
                secondType:options.secondType,
                necessary:options.necessary,
                mark:options.mark,
                money:options.money
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //判断app中的costType是否为空
        if (app.globalData.costType == undefined) {
            this.getAllCostType();
        } else {
            this.setData({
                costType: util.costTypeToPicker(app.globalData.costType)
            });
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})