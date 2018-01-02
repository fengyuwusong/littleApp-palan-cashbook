// pages/list/more.js
var requestUrl = require('../../requestUrl');
var util = require('../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: util.getDate(),
        costIncomeList: {},
        costList: {},
        incomeList: {},
        listFlag: 0,
        now:util.getDate()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        var start = util.dateTimeToTimeStamp(util.getDate());
        var condition = {
            start: start,
            end: start + 24 * 60 * 60,
            uid: app.globalData.uid
        };
        this.getRecentCostInComeList(condition);
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

    },

    //上一天
    lastDay:function () {
        var lastDay=util.dateTimeToTimeStamp(this.data.date)-24 * 60 * 60;
        var date=new Date();
        date.setTime(lastDay*1000);
        this.setData({
            date: date.format('yyyy-MM-dd'),
        });
        var condition = {
            start: lastDay,
            end: lastDay + 24 * 60 * 60,
            uid: app.globalData.uid
        };
        this.getRecentCostInComeList(condition);
    },

    //下一天
    nextDay:function () {
        var nextDay=util.dateTimeToTimeStamp(this.data.date)+24 * 60 * 60;
        var date=new Date();
        date.setTime(nextDay*1000);
        this.setData({
            date:  date.format('yyyy-MM-dd'),
        });
        var condition = {
            start: nextDay,
            end: nextDay + 24 * 60 * 60,
            uid: app.globalData.uid
        };
        this.getRecentCostInComeList(condition);
    },

    //日期改变事件
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        });
        var start=util.dateTimeToTimeStamp(e.detail.value+" 00:00:00");
        var condition = {
            start: start,
            end: start + 24 * 60 * 60,
            uid: app.globalData.uid
        };
        this.getRecentCostInComeList(condition);
    },



    //查看最近收支明细
    getRecentCostInComeList: function (condition) {
        util.showBusy("加载中~");
        this.findCostListByCondition(condition);
        this.findIncomeListByCondition(condition);
    },

    //查看最近支出
    findCostListByCondition: function (condition) {
        var that = this;
        util.request(requestUrl.findCostListByCondition, 'POST', condition, 'form', function (res) {
            if (res.data.code == 200 || res.data.code == 400) {
                that.setData({
                    costList: res.data
                });
                that.listFlag();
            } else {
                util.showModel("错误", res.data.message);
                console.log(res.data);
            }
        }, function (res) {
            util.showModel("未知错误", "请重新打开小程序或检测是否有网络~");
            console.log(res);
        }, null);
    },
    //查看最近收入
    findIncomeListByCondition: function (condition) {
        var that = this;
        util.request(requestUrl.findIncomeListByCondition, 'POST', condition, 'json', function (res) {
            if (res.data.code == 200 || res.data.code == 400) {
                that.setData({
                    incomeList: res.data
                });
                that.listFlag();
            } else {
                util.showModel("错误", res.data.message);
                console.log(res.data);
            }
        }, function (res) {
            util.showModel("未知错误", "请重新打开小程序或检测是否有网络~");
            console.log(res);
        }, null);
    },
    //判断是否全部获取完成 如果完成则执行最终排序
    listFlag: function () {
        this.setData({
            listFlag: this.data.listFlag + 1
        });
        if (this.data.listFlag == 2) {
            var p1 = null;
            var p2 = null;
            if (this.data.costList.data !== undefined) {
                p1 = this.data.costList.data.list;
            }
            if (this.data.incomeList.data !== undefined) {
                p2 = this.data.incomeList.data.list;
            }
            var costIncomeList = util.sortCostIncomeList(p1, p2);
            this.setData({
                costIncomeList: costIncomeList == undefined ? null : costIncomeList
            });
            wx.hideToast();
            this.setData({
                listFlag: 0
            });
        }
    },
})