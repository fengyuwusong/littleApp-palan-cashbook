//接口请求地址
var base = 'https://www.fengyuwusong.cn/cashPlayBook';
// var base = 'http://localhost';
var requestUrl = {
    base,
    /**
     * 通过openid查找用户是否已经存在
     * 请求:get
     * 参数 +{openid}
     */
    getUserByOpenid: `${base}/user/openid/`,


    /**
     * 保存一个用户
     * 请求：post
     * 参数：User
     * {
              "avatarUrl": "string",    头像url
              "city": "string",         城市
              "country": "string",      国家
              "createTime": 0,          创建时间
              "language": "string",     语言
              "nickname": "string",     昵称
              "openId": "string",       openid
              "province": "string"      省份
            }
     */
    addUser: `${base}/user`,


    /**
     * 添加一笔支出
     * 请求：post
     * 参数：Cost
     * {
              "createTime": 0,          创建时间
              "mark": "string",         备注
              "money": 0,               金额
              "necessary": 0,           必要的   0->不必要  1->必要
              "uid": 0,                 用户id
              "type": 0                 类型id
            }
     */
    addCost: `${base}/cost`,


    /**
     * 修改一笔支出
     * 请求：put
     * 参数：Cost
     * {
              "createTime": 0,
              "id": 0,                   必要
              "mark": "string",
              "money": 0,
              "necessary": 0,
              "uid": 0,                 用户id
              "type": 0
            }
     */
    updateCost: `${base}/cost`,


    /**
     * 通过条件查询支出
     * 请求：post
     * 参数：
     *      necessary:  是否必要(0->不必要 1->必要)
     *      start:      开始时间戳
     *      end:        结束时间戳
     *      type:       类型id
     *      gtMoney:    最小金额
     *      ltMoney:    最大金额
            uid: 0,                 用户id
     *      page:       页码
     *      size:       页显示数
     */
    findCostListByCondition: `${base}/cost/findListByCondition`,


    /**
     * 获取时间戳内总金额
     * 请求：get
     * 参数：+?
            uid                用户id
     *      start   开始时间戳
     *      end     结束时间戳
     */
    getCostSum: `${base}/cost/getSum`,
    /**
     * 删除一笔消费
     * delete
     * 路径参数     +costId
     */
    deleteCost: '/cost/',
    /**
     * 查看一笔消费详情
     * get
     * +costId
     */
    getCost: `${base}/cost/`,


    /**
     * 添加一级消费类型
     * 请求：post
     * 参数：
     *      {
              "name": "string",
              "uid": 0
            }
     */
    addFirstCostType: `${base}/cost/type/first`,
    /**
     * 修改一级消费类型
     * 请求：put
     * 参数：
     * {
          "id": 0,
          "name": "string",
        }
     */
    updateFirstCostType: `${base}/cost/type/first`,
    /**
     * 删除一级消费类型
     * 请求：delete
     * 参数：
     *  +{id}
     */
    deleteFirstCostType: `${base}/cost/type/first/`,
    /**
     * 添加二级消费分类
     * 请求：post
     * 参数
     * {
          "fid": 0,     一级分类id
          "name": "string",
          "uid": 0
        }
     */
    addSecondCostType: `${base}/cost/type/second`,
    /**
     * 修改二级消费分类
     * 请求：put
     * 参数
     * {
     *    "id":  0,
          "fid": 0,     一级分类id
          "name": "string",
        }
     */
    updateSecondCostType: `${base}/cost/type/second`,
    /**
     * 删除二级消费类型
     * 请求：delete
     * 参数：
     *  +{id}
     */
    deleteSecondCostType: `${base}/cost/type/second/`,
    /**
     * 通过uid获取所有消费类型
     * 请求：get
     * 参数 +{uid}
     */
    getAllCostType: `${base}/cost/type/`,

    /**
     * 添加收入类型
     * 请求：post
     * 参数
     * {
          "name": "string",
          "uid": 0
        }
     */
    addIncomeType: `${base}/income/type`,
    /**
     * 修改收入类型
     * 请求：put
     * 参数
     * {
          "createTime": 0,
          "mark": "string",
          "money": 0,
          "openId": "string",
          "type": 0,
          "id":0
        }
     */
    updateIncomeType: `${base}/income/type`,
    /**
     * 删除收入类型
     * 请求：delete
     * 参数：
     *  +{id}
     */
    deleteIncomeType: `${base}/income/type/`,
    /**
     * 获取该用户所有收入类型
     * 请求：get
     * 参数：
     *  +{uid}
     */
    getAllIncomeType: `${base}/income/type/`,
    /**
     * 添加一笔收入
     * 请求：post
     * 参数：
     * {
          "createTime": 0,
          "mark": "string",
          "money": 0,
          "uid": 0,                 用户id
          "type": 0
        }
     */
    addIncome: `${base}/income`,
    /**
     * 修改一笔收入
     * 请求：put
     * 参数：
     * {
          "createTime": 0,
          "mark": "string",
          "money": 0,
          "uid": 0,                 用户id
          "type": 0,
          "id":0
        }
     */
    updateIncome: `${base}/income`,
    /**
     * 按照条件筛选收入
     * POST
     * 参数：
     * {
            {
              "end": 0,
              "gtMoney": 0, //最小金额
              "ltMoney": 0, //最大金额
              "uid": 0,                 用户id
              "start": 0,
              "type": 0
             }
            page:0,
            size:0
        }
     */
    findIncomeListByCondition: `${base}/income/findListByCondition`,
    /**
     * 计算时间段内的收入
     * get
     * 参数
     *      ?uid=1&start=0&end=1123
     */
    getIncomeSum: `${base}/income/getSum`,
    /**
     * 删除收入
     * 请求：delete
     * 参数：
     *  +{id}
     */
    deleteIncome: `${base}/income/`,
    /**
     * 查看收入向详情
     * 请求：get
     * 参数：
     *  +{id}
     */
    getIncome: `${base}/income/`,

}

module.exports = requestUrl;