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
        detailFlag: false,
        money: 0,
        firstTypeId: null,
        secondTypeId: null,
        necessary: null,
        mark: null,
        id: null
    },

    //multiSelector确定事件
    typePickerChange: function (e) {
        this.setData({
            index: e.detail.value
        });
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
        else if (e.detail.column == 1) {
            var id = null;
            appData.map(function (item, index, input) {
                id = thisData[1][e.detail.value].fid;
                if (id == item.firstTypeId) {
                    var i0=index;
                    that.setData({
                        index:[i0,e.detail.value]
                    })
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
            necessary: event.detail.value.necessary ? 1 : 0,
            mark: event.detail.value.mark,
            createTime: util.dateTimeToTimeStamp(this.data.date + " " + this.data.time + ":" + new Date().getSeconds()),
            type: this.data.costType[1][this.data.index[1]].id,
            uid: app.globalData.uid
        };
        console.log(this.data.date + " " + this.data.time + ":" + new Date().getSeconds());
        //判空 是否为数字
        if (util.isNotEmpty(cost.money, "金额") && util.isNum(cost.money, '金额')) {
            if (this.data.detailFlag) {
                cost.id = this.data.id;
                this.updateCost(cost);
            } else {
                this.addCost(cost);
            }
        }
    },

    //添加支出
    addCost: function (cost) {
        util.showBusy("添加中~");
        util.request(requestUrl.addCost, 'post', cost, 'json', function (res) {
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

    //修改支出
    updateCost: function (cost) {
        util.showBusy("修改中~");
        util.request(requestUrl.addCost, 'put', cost, 'json', function (res) {
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

    //删除支出
    deleteCost: function () {
        util.showBusy("删除中~");
        util.request(requestUrl.deleteCost + this.data.id, 'delete', {}, 'json', function (res) {
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

    //查看所有消费类型
    getAllCostType: function () {
        util.showBusy("加载中~");
        var uid = app.globalData.uid;
        var that = this;
        util.request(requestUrl.getAllCostType + uid, 'get', {}, 'json', function (res) {
            var data = res.data.data;
            app.globalData.costType = data;
            if (that.data.detailFlag) {
                res.data.data.map(function (item, index, input) {
                    if (item.firstTypeId == that.data.firstTypeId) {
                        var i0 = index;
                        item.list.map(function (item, index, input) {
                            if(item.id==that.data.secondTypeId){
                                that.setData({
                                    index:[i0,index]
                                })
                            }
                        });
                    }
                });
            }
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
        if (options.id !== undefined) {
            var dateTime = util.spiltDateTime(options.createTime);
            this.setData({
                detailFlag: true,
                date: dateTime[0],
                time: dateTime[1],
                firstTypeId: options.firstTypeId,
                secondTypeId: options.secondTypeId,
                necessary: options.necessary,
                mark: options.mark,
                money: options.money * -1,
                id: options.id
            });
            if(app.globalData.costType !== undefined){
                var appData=app.globalData.costType;
                var that=this;
                if (this.data.detailFlag) {
                    appData.map(function (item, index, input) {
                        if (item.firstTypeId == that.data.firstTypeId) {
                            var i0 = index;
                            item.list.map(function (item, index, input) {
                                if (item.id == that.data.secondTypeId) {
                                    that.setData({
                                        index: [i0, index]
                                    });
                                    return;
                                }
                            });
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
        if (app.globalData.costType === undefined) {
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