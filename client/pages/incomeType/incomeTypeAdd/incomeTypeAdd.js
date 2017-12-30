// pages/incomeType/incomeTypeAdd/incomeTypeAdd.js
var requestUrl = require('../../../requestUrl');
var util = require('../../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    //点击保存事件
    formSubmit: function (e) {
        util.showBusy("添加中~");
        var name = e.detail.value.name;
        if (util.isNotEmpty(name, "分类名称")) {
            this.addIncomeType(name);
        }
    },

    //添加收入类型
    addIncomeType: function (name) {
        var incomeType = {
            uid: app.globalData.uid,
            name: name,
        };
        util.request(requestUrl.addIncomeType, "post", incomeType, "json", function (res) {
            if (res.data.code == 200) {
                util.showSuccess("添加成功~");
                //返回上一页面
                wx.navigateBack({
                    delta: 1
                })
            } else {
                util.showModel("添加失败~", "错误原因：" + res.data.message);
            }
        })
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