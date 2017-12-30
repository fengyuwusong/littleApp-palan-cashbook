var requestUrl = require('../../../requestUrl');
var util = require('../../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeFlag: null,
        firstType: {},
        index: 0,
    },

    //点击保存事件
    formSubmit: function (e) {
        util.showBusy("添加中~");
        var secondTypeName = e.detail.value.secondTypeName;
        if (!util.isNotEmpty(secondTypeName,"二级分类名称")) {
            return
        }
        if (this.data.typeFlag == false) {
            var firstTypeName = e.detail.value.firstTypeName;
            if (util.isNotEmpty(firstTypeName,"一级分类名称")) {
                //添加一级分类及二级分类
                this.addFirstCostType(firstTypeName, secondTypeName);
            }
        } else {
            var index = this.data.index;
            this.addSecondCostType(secondTypeName, this.data.firstType[index].firstTypeId);
        }
    },


    //添加一级消费类型获得id后添加二级分类
    addFirstCostType: function (firstCostTypeName, secondTypeName) {
        var firstCostType = {
            uid: app.globalData.uid,
            name: firstCostTypeName
        };
        var that=this;
        util.request(requestUrl.addFirstCostType, "post", firstCostType, "json", function (res) {
            if(res.data.code==200){
                that.addSecondCostType(secondTypeName, res.data.data);
            }else{
                util.showModel("添加失败~","错误原因："+res.message);
            }
        })
    },
    //添加二级消费类型
    addSecondCostType: function (name, fid) {
        var secondCostType = {
            uid: app.globalData.uid,
            name: name,
            fid: fid
        };
        util.request(requestUrl.addSecondCostType, "post", secondCostType, "json", function (res) {
            if(res.data.code==200) {
                util.showSuccess("添加成功~");
                //返回上一页面
                wx.navigateBack({
                    delta: 1
                })
            }else{
                util.showModel("添加失败~","错误原因："+res.message);
            }
        })
    },

    //picker改变函数
    bindChange: function (e) {
        if (e.detail.value == this.data.firstType.length - 1) {
            this.setData({
                typeFlag: false
            });
        }
        ;
        this.setData({
            index: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var firstType = app.globalData.costType;
        firstType.push({
            firstTypeName: "新分类",
        });
        //设置一级分类
        this.setData({
            firstType: firstType
        });
        if (this.data.firstType.length - 1 == 0) {
            this.setData({
                typeFlag: false
            });
        } else {
            this.setData({
                typeFlag: true
            });
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