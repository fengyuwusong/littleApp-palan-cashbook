const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();
    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}


//request请求封装
function request(url, mothod, postData, header, doSuccess, doFail, doComplete) {
    if (header == 'form') {
        header = {"Content-Type": "application/x-www-form-urlencoded"};
    } else if (header == 'json') {
        header = {
            'content-type': 'application/json'
        };
    }
    wx.request({
        url: url,
        data: postData,
        method: mothod,
        header: header,
        success: function (res) {
            if (typeof doSuccess == "function") {
                doSuccess(res);
            }
        },
        fail: function () {
            if (typeof doFail == "function") {
                doFail();
            }
        },
        complete: function () {
            if (typeof doComplete == "function") {
                doComplete();
            }
        }
    });
}

//获取当前年月日 yyyy-MM-dd
function getDate() {
    var now = new Date();
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

//获取当前时间 hh-mm
function getTime() {
    var now = new Date();
    const hour = now.getHours()
    const minute = now.getMinutes()

    return [hour, minute].map(formatNumber).join(':')
}

//将costType转为picker对象
function costTypeToPicker(data) {
    var costType = [];
    costType[0] = [];
    costType[1] = [];
    for (var i = 0; i < data.length; i++) {
        costType[0].push({name: data[i].firstTypeName, fid: data[i].firstTypeId});
        for (var j = 0; j < data[i].list.length; j++) {
            costType[1].push(data[i].list[j]);
        }
    }
    return costType;
}

//日期转时间戳
function dateTimeToTimeStamp(dateTime) {
    return parseInt(Date.parse(new Date(dateTime)) / 1000);
}

//判空
function isNotEmpty(str, errorMsg) {
    if (self::isNullOrEmpty(str)) {
        this.showModel("错误", errorMsg + "不能为空~");
        return false;
    }
    return true;
}

//判断是否是数字
function isNum(num, errorMsg) {
    if (isNaN(num)) {
        this.showModel("错误", errorMsg + "不是数字~");
        return false;
    }
    return true;
}

//检测是否为空
function isNullOrEmpty(obj) {
    var flag = false;
    if (obj == null || obj == undefined || typeof (obj) == 'undefined' || obj == '') {
        flag = true;
    } else if (typeof (obj) == 'string') {
        obj = obj.trim();
        if (obj == '') {//为空
            flag = true;
        } else {//不为空
            obj = obj.toUpperCase();
            if (obj == 'NULL' || obj == 'UNDEFINED' || obj == '{}') {
                flag = true;
            }
        }
    }
    else {
        flag = false;
    }
    return flag;
}


//将收入支出按照时间穿插排序
function sortCostIncomeList(costList, incomeList) {
    if(costList===null&&incomeList===null){
        return
    }else if(costList===null){
        var list = incomeList;
        list.map(function (item, index, input) {
            if(item.money>0){
                item.money="+"+item.money;
            }
            item.createTime = self::formatTime(new Date(item.createTime * 1000));
        });
        return list;
    }else if(incomeList===null){
        costList.map(function (item, index, input) {
            input[index].money *= -1;
        });
        var list = costList;
        list.map(function (item, index, input) {
            if(item.money>0){
                item.money="+"+item.money;
            }
            item.createTime = self::formatTime(new Date(item.createTime * 1000));
        });
        return list;
    }
    costList.map(function (item, index, input) {
        input[index].money *= -1;
    });
    var list = costList.concat(incomeList);
    list.sort(function (a, b) {
        return b.createTime - a.createTime
    });
    list.map(function (item, index, input) {
        if(item.money>0){
            item.money="+"+item.money;
        }
        item.createTime = self::formatTime(new Date(item.createTime * 1000));
    })
    return list;
}


//获得指定月份的日期的时间戳
function addDayTimeStamp(day) {
    var date = new Date()
    var year = date.getYear() + 1900;
    var month = date.getMonth() + 1;
    var today = year + "-" + month + "-" + day;
    return self::dateTimeToTimeStamp(today);
}

//分割  将yyyy-MM-dd hh:mm 分成date和time
function spiltDateTime(dateTime) {
    return dateTime.split(" ");
}


module.exports = {
    formatTime,
    showBusy,
    showSuccess,
    showModel,
    request,
    getDate,
    getTime,
    costTypeToPicker,
    dateTimeToTimeStamp,
    isNotEmpty,
    isNum,
    sortCostIncomeList,
    addDayTimeStamp,
    spiltDateTime
}
