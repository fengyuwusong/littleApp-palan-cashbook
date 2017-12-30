// pages/costType/costType.js
var requestUrl = require('../../requestUrl');
var util = require('../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    addCostType: function (event) {
        wx.navigateTo({
            url: "/pages/costType/costTypeAdd/costTypeAdd"
        })
    },


    //查看所有消费类型
    getAllCostType: function () {
        util.showBusy("加载中~");
        var uid = app.globalData.uid;
        var that = this;
        util.request(requestUrl.getAllCostType + uid, 'get', {}, 'json', function (res) {
            app.globalData.costType = res.data.data;
            that.setData({
                costType: res.data.data
            });
            wx.hideToast();
        }, null, null);
    },

    //删除一级消费类型及分类下的所有二级分类
    deleteFirstCostType: function (event) {
        var that = this;
        var firstName = event.currentTarget.dataset.firstName;
        var firstId = event.currentTarget.dataset.firstId;
        wx.showModal({
            title: '删除',
            content: '确定删除分类' + firstName + "和该分类下的所有二级分类吗？",
            success: function (res) {
                if (res.confirm) {
                    util.request(requestUrl.deleteFirstCostType + firstId, 'delete', {}, 'json', function (res) {
                        that.getAllCostType();
                    }, null, null);
                } else if (res.cancel) {
                }
            }
        });
    },

    //删除二级分类
    deleteSecondCostType: function (event) {
        var that = this;
        var secondName = event.currentTarget.dataset.secondName;
        var secondId = event.currentTarget.dataset.secondId;
        wx.showModal({
            title: '删除',
            content: '确定删除分类' + secondName + "吗？",
            success: function (res) {
                if (res.confirm) {
                    util.request(requestUrl.deleteSecondCostType + secondId, 'delete', {}, 'json', function (res) {
                        that.getAllCostType();
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
        this.getAllCostType();
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
        this.getAllCostType();
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