// pages/addIncome/addIncome.js
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
        incomeType: {},
        index: 0
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
    //获取所有收入类型
    getAllIncomeType: function () {
        util.showBusy("加载中~");
        var uid = app.globalData.uid;
        var that = this;
        util.request(requestUrl.getAllIncomeType + uid, 'get', {}, 'json', function (res) {
            app.globalData.incomeType = res.data.data;
            that.setData({
                incomeType: res.data.data
            });
            wx.hideToast();
        }, null, null);
    },

    //picker改变函数
    bindChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },

    //提交
    formSubmit: function (e) {
        var income = {
            createTime: util.dateTimeToTimeStamp(this.data.date + " " + this.data.time),
            mark: e.detail.value.mark,
            money: e.detail.value.money,
            uid: app.globalData.uid,
            type: this.data.incomeType[this.data.index].id
        };
        if (util.isNotEmpty(income.money, "金额") && util.isNum(income.money, "金额")) {
            this.addIncome(income);
        }
    },

    //添加一笔收入
    addIncome: function (income) {
        util.showBusy("添加中~")
        util.request(requestUrl.addIncome, "post", income, "json", function (res) {
            if (res.data.code == 200) {
                util.showSuccess("成功~");
                //返回上一页面
                wx.navigateBack({
                    delta: 1
                })
            } else {
                util.showModel("错误", res.data.message);
            }
        }, null, null);
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
        //判断app中的costType是否为空
        if (app.globalData.incomeType == undefined) {
            this.getAllIncomeType();
        } else {
            this.setData({
                incomeType: app.globalData.incomeType
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