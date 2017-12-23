<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql as mysql;

class CashBook extends CI_Controller {

    // 查询最近20条数据
    // 按照日期查询该天账本
    // 计算本月支出 本月收入 收支差额 预算剩余
    // 记账
    // 设置预算
    // 记录收入
    // 按照分类画表 柱状 饼形
    // 按照月份画表 柱状 
    // 按照天画表
    public function index() {
        $this->json([
            'code' => 0,
            'data' => [
                'msg' => 'Hello World'
            ]
        ]);
    }
}