// pages/feedback/feedback.js
var requestUrl = require('../../requestUrl');
var util = require('../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    //提交
    formSubmit: function (e) {
        util.showBusy("提交中~");
        var data={
            content : e.detail.value.content.toString(),
            uid : app.globalData.uid
        };
        util.request(requestUrl.feedback, "get", data, "json", function (res) {
            if (res.data.code === 200) {
                wx.hideToast();
                wx.showModal({
                    title: "提交成功~",
                    content: "感谢你的建议(*^▽^*)",
                    showCancel: false,
                    success: function () {
                        //返回上一页面
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            } else {
                console.log(res);
                util.showModel("错误~", res.data);
            }
        }, null, null);
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