var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    },
    onLoad: function (options) {
        this.login();
    },

    // 用户登录示例
    login: function () {
        if (this.data.logged) return

        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    that.setData({
                        userInfo: result,
                        logged: true
                    });
                    app.globalData =that.data;
                    console.log("22222");
                    console.log(app.globalData)                    
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
                            console.log("1111");
                            console.log(app.globalData)     
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
            }
        })
    },
})
