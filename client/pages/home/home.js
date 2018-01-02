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
        costIncomeList: {},
        costList: {},
        incomeList: {},
        costSum: 0,
        incomeSum: 0,
        listFlag:0,
        headerTime:null
    },

    onLoad: function (options) {
        // 加载时自动登录
        this.login();

        var hour=new Date().getHours();
        if(hour>5&&hour<12){
            this.setData({
                headerTime:"早上好"
            });
        }else if(hour>12&&hour<18){
            this.setData({
                headerTime:"下午好"
            });
        }else if(hour>18&&hour<23){
            this.setData({
                headerTime:"晚上好"
            });
        }else{
            this.setData({
                headerTime:"夜深了"
            });
        }
    },
    onShow: function () {
        var uid = app.globalData.uid;
        if (uid != "") {
            this.getRecentCostInComeList(uid);
            this.getCostSum(uid);
            this.getIncomeSum(uid);
        }
    },
    //查看最近收支明细
    getRecentCostInComeList: function (uid) {
        var now = parseInt((new Date()).valueOf() / 1000);
        var condition = {
            start: (now - 24 * 60 * 60 * 2),
            uid: uid
        };
        this.findCostListByCondition(condition);
        this.findIncomeListByCondition(condition);
    },

    //判断是否全部获取完成 如果完成则执行最终排序
    listFlag:function () {
        this.setData({
            listFlag:this.data.listFlag+1
        });
        if(this.data.listFlag==2){
            var p1 = null;
            var p2 = null;
            if (this.data.costList.data !== undefined) {
                p1 = this.data.costList.data.list;
            }
            if (this.data.incomeList.data !== undefined) {
                p2 = this.data.incomeList.data.list;
            }
            var costIncomeList = util.sortCostIncomeList(p1, p2);
            this.setData({
                costIncomeList: costIncomeList==undefined?null:costIncomeList
            });
            this.setData({
                listFlag:0
            });
        }
    },

    //查看最近支出
    findCostListByCondition: function (condition) {
        var that = this;
        util.request(requestUrl.findCostListByCondition, 'POST', condition, 'form', function (res) {
            if (res.data.code == 200 || res.data.code == 400) {
                that.setData({
                    costList: res.data
                });
                that.listFlag();
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
                that.listFlag();
            } else {
                util.showModel("错误", res.data.message);
                console.log(res.data);
            }
        }, function (res) {
            util.showModel("未知错误", "请重新打开小程序或检测是否有网络~");
            console.log(res);
        }, null);
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

    //跳转更多
    more:function () {
        wx.navigateTo({
            url: "/pages/more/more"
        })
    },

    //home
    home: function (user) {
        var that = this;
        user.createTime = (new Date()).valueOf() / 1000;
        util.request(requestUrl.home + util.addDayTimeStamp(1), 'post', user, 'json', function (res) {
            //设置获取到的所有变量
            app.globalData.uid = res.data.data.user.id;
            var costIncomeList = util.sortCostIncomeList(res.data.data.costList, res.data.data.incomeList);
            that.setData({
                costSum: res.data.data.costSum,
                incomeSum: res.data.data.incomeSum,
                costIncomeList: costIncomeList,
            });
            util.showSuccess("登录成功");
        }, function (res) {
            util.showModel("未知错误", "请重新打开小程序或检测是否有网络~");
            console.log(res);
        }, null)
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
                    that.home(result);
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
                            that.home(result.data.data);
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

    //点击对已添加支出收入进行编辑删除
    detail:function (event) {
        if(event.currentTarget.dataset.type=="cost"){
            var cost=this.data.costIncomeList[event.currentTarget.dataset.index];
            var id=cost.id;
            var createTime=cost.createTime;
            var firstTypeId=cost.firstType.id;
            var mark=cost.mark;
            var money=cost.money;
            var necessary=cost.necessary;
            var secondTypeId=cost.secondType.id;
            wx.navigateTo({
                url: '../addCost/addCost?id='+id
                +"&createTime="+createTime+"&firstTypeId="+firstTypeId
                +"&mark="+mark+"&money="+money+"&necessary="+necessary
                +"&secondTypeId="+secondTypeId
            })
        }
        else if(event.currentTarget.dataset.type=="income"){
            var income=this.data.costIncomeList[event.currentTarget.dataset.index];
            var id=income.id;
            var createTime=income.createTime;
            var mark=income.mark;
            var money=income.money;
            var incomeTypeName=income.incomeType.name;
            wx.navigateTo({
                url: '../addIncome/addIncome?id='+id
                +"&createTime="+createTime+"&incomeTypeName="+incomeTypeName
                +"&mark="+mark+"&money="+money
            })
        }

    }



})
