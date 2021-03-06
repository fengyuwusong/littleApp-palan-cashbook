// pages/setting/setting.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
    },

    //跳转至收入类型页面
    incomeType:function (event) {
        wx.navigateTo({
            url: "/pages/incomeType/incomeType"
        })
    },

    //跳转至支出类型页面
    costType:function (event) {
        wx.navigateTo({
            url: "/pages/costType/costType"
        })
    },

    feedback:function (event) {
        wx.navigateTo({
            url: "/pages/feedback/feedback"
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo,
        });
        console.log(this.data);
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