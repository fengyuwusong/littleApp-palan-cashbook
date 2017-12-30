// pages/incomeType/incomeType.js
var requestUrl = require('../../requestUrl');
var util = require('../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        incomeType:{}
    },

    addIncomeType: function (event) {
        wx.navigateTo({
            url: "/pages/incomeType/incomeTypeAdd/incomeTypeAdd"
        })
    },

    //获取所有收入类型
    getAllIncomeType:function () {
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


    delete:function (event) {
        var that = this;
        var name = event.currentTarget.dataset.name;
        var id = event.currentTarget.dataset.id;
        wx.showModal({
            title: '删除',
            content: '确定删除分类' + name + "吗？",
            success: function (res) {
                if (res.confirm) {
                    util.request(requestUrl.deleteIncomeType + id, 'delete', {}, 'json', function (res) {
                        that.getAllIncomeType();
                    }, null, null);
                } else if (res.cancel) {
                }
            }
        });
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
        this.getAllIncomeType();
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
        this.getAllIncomeType();
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