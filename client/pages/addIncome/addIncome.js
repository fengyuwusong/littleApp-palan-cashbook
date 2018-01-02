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
            if (that.data.detailFlag) {
                res.data.data.map(function (item, index, input) {
                    if(item.name==that.data.incomeTypeName){
                        that.setData({
                            index:index
                        });
                        return;
                    }
                });
            }
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
            createTime: util.dateTimeToTimeStamp(this.data.date + " " + this.data.time+":"+new Date().getSeconds()),
            mark: e.detail.value.mark,
            money: e.detail.value.money,
            uid: app.globalData.uid,
            type: this.data.incomeType[this.data.index].id
        };
        if (util.isNotEmpty(income.money, "金额") && util.isNum(income.money, "金额")) {
            if (this.data.detailFlag) {
                income.id = this.data.id;
                this.updateIncome(income);
            } else {
                this.addIncome(income);
            }
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

    //修改一笔收入
    updateIncome:function (income) {
        util.showBusy("修改中~")
        util.request(requestUrl.updateIncome, "put", income, "json", function (res) {
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

    //删除一笔收入
    deleteIncome:function () {
        util.showBusy("删除中~");
        util.request(requestUrl.deleteIncome + this.data.id, 'delete', {}, 'json', function (res) {
            if (res.data.code == 200) {
                util.showSuccess("成功~");
                //返回上一页面
                wx.navigateBack({
                    delta: 1
                })
            } else {
                util.showModel("错误", res.data.message);
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id !== undefined) {
            var dateTime = util.spiltDateTime(options.createTime);
            this.setData({
                detailFlag: true,
                date: dateTime[0],
                time: dateTime[1],
                necessary: options.necessary,
                mark: options.mark,
                money: options.money.substring(1), //截取去掉+
                id: options.id,
                incomeTypeName:options.incomeTypeName
            });
            if(app.globalData.incomeType !== undefined){
                var appData=app.globalData.incomeType;
                var that=this;
                if (this.data.detailFlag) {
                    appData.map(function (item, index, input) {
                        if(item.name==that.data.incomeTypeName){
                            that.setData({
                                index:index
                            });
                            return;
                        }
                    });
                }
            }
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