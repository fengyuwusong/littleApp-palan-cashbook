var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var requestUrl = require('../../requestUrl');
var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        costType: {},
        incomeType: {},
        costIncomeList: {},
        costList: {},
        incomeList: {},
        costSum: 0,
        incomeSum: 0,
        once:true
    },
    onLoad: function (options) {
        // 加载时自动登录
        this.login();
        this.setData({
            once:false
        })
    },
    onShow:function () {
        if(this.data.once){
            var uid=app.globalData.uid;
            this.getRecentCostInComeList(uid);
            this.getCostSum(uid);
            this.getIncomeSum(uid);
        }
    },


    //查看最近收支明细
    getRecentCostInComeList: function (uid) {
        var now = parseInt((new Date()).valueOf() / 1000);
        var condition = {
            start: (now - 24 * 60 * 60 * 3),
            uid: uid
        };
        this.findCostListByCondition(condition);
    },

    //查看最近支出
    findCostListByCondition: function (condition) {
        var that = this;
        util.request(requestUrl.findCostListByCondition, 'POST', condition, 'form', function (res) {
            if (res.data.code == 200 || res.data.code == 400) {
                that.setData({
                    costList: res.data
                });
                that.findIncomeListByCondition(condition);
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
                var costIncomeList = util.sortCostIncomeList(that.data.costList.data, res.data.data);
                that.setData({
                    costIncomeList: costIncomeList
                });
                util.showSuccess('登录成功');
            } else {
                util.showModel("错误", res.data.message);
                console.log(res.data);
            }
        }, function (res) {
            util.showModel("未知错误", "请重新打开小程序或检测是否有网络~");
            console.log(res);
        }, null);
    },

    //查看所有消费类型
    getAllCostType: function () {
        var uid = app.globalData.uid;
        var that = this;
        util.request(requestUrl.getAllCostType + uid, 'get', {}, 'json', function (res) {
            app.globalData.costType = res.data.data;
            that.setData({
                costType: res.data.data
            });
        }, null, null);
    },

    //获取所有收入类型
    getAllIncomeType: function () {
        var uid = app.globalData.uid;
        var that = this;
        util.request(requestUrl.getAllIncomeType + uid, 'get', {}, 'json', function (res) {
            app.globalData.incomeType = res.data.data;
            that.setData({
                incomeType: res.data.data
            });
        }, null, null);
    },

    //跳转至添加支出页
    addCost: function (event) {
        wx.navigateTo({
            url: "/pages/addCost/addCost"
        })
    },
    //跳转至添加支出页
    addIncome: function (event) {
        wx.navigateTo({
            url: "/pages/addIncome/addIncome"
        })
    },

    //跳转至设置页面
    setting: function (event) {
        wx.navigateTo({
            url: "/pages/setting/setting"
        })
    },
    //验证该微信用户是否已经存在
    getUserByOpenid: function (openid) {
        var that = this;
        util.request(requestUrl.getUserByOpenid + openid, 'GET', {}, 'json', function (res) {
            //不存在添加
            if (res.data.data == null) {
                var user = that.data.userInfo;
                user.createTime = (new Date()).valueOf() / 1000;
                util.request(requestUrl.addUser, "POST", user, 'json', function (res) {
                    app.globalData.uid = res.data.data;
                }, null, null);
            } else {
                app.globalData.uid = res.data.data.id;
            }
        }, function (res) {
            util.showModel("未知错误", "请重新打开小程序或检测是否有网络~");
            console.log(res);
        }, function () {
            //完成后加载用户所有分类及最近开支
            that.getAllCostType();
            that.getAllIncomeType();
            //加载时查询最近收支明细
            that.getRecentCostInComeList(app.globalData.uid);
            that.getCostSum(app.globalData.uid);
            that.getIncomeSum(app.globalData.uid);

        })
    },

    //计算这个月的支出
    getCostSum: function (uid) {
        var that = this;
        var data = {
            uid: uid,
            start: util.addDayTimeStamp(1),
            end: parseInt((new Date()).valueOf() / 1000)
        };
        util.request(requestUrl.getCostSum, 'get', data, 'json', function (res) {
            that.setData({
                costSum: res.data.data
            });
        }, null, null);
    },
    //计算这个月的收入
    getIncomeSum: function (uid) {
        var that = this;
        var data = {
            uid: uid,
            start: util.addDayTimeStamp(1),
            end: parseInt((new Date()).valueOf() / 1000)
        };
        util.request(requestUrl.getIncomeSum, 'get', data, 'json', function (res) {
            that.setData({
                incomeSum: res.data.data
            });
        }, null, null);
    },


    // 用户登录示例
    login: function () {
        if (this.data.logged) return
        util.showBusy('正在登录');
        var that = this;
        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    that.setData({
                        userInfo: result,
                        logged: true
                    });
                    app.globalData = that.data;
                    console.log(result);
                    that.getUserByOpenid(result.openId);
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            });
                            app.globalData = that.data;
                            that.getUserByOpenid(result.data.data.openId);
                        },
                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            },
        })
    },
})
