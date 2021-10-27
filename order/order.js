const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const order_router = express.Router();
const { setQuerySql } = require('../util');

order_router.get('/get/', (req, res) => {
    const params = req.query;
    const { currentPage, type, orderStatus, orderId, userName, realName, takeContacts, receiveContacts, receiptUserName, receiptRealName, paymentMethod } = params;
    const queryParams = { type, orderStatus, orderId, userName, realName, takeContacts, receiveContacts, receiptUserName, receiptRealName, paymentMethod }
    let { sql, paramsArr } = setQuerySql('SELECT * FROM order_info', queryParams)
    sql += ' ORDER BY id desc';
    let result = new Result(-1, '');
    if (type, orderStatus) {
      pool.getConnection((err, conn) => {
        conn.query(sql, paramsArr, function (error, results, fields) {
          if (error) throw error;
          const pageSize = 5;
          const startNum = (currentPage - 1) * pageSize;
          let newResults = [];
          for (let i = startNum; i < startNum + pageSize; i++) {
              if (i < results.length) {
                  newResults.push(results[i])
              }
          }
          const finalRes = {
              currentPage,
              pageSize,
              total: results.length,
              result: newResults
          }
          result = new Result(200, '获取订单信息成功', finalRes);
          res.send(result);
        })
        conn.release();
      })
    } else {
      result = new Result(-1, '获取订单信息失败');
      res.send(result);
    }
  })

  order_router.get('/delete/', (req, res) => {
    const params = req.query;
    const { orderId } = params;
    let result = new Result(-1, '');
    if (orderId) {
      //1、查询数据库中是否有此订单号
      pool.getConnection((err, conn) => {
        conn.query("SELECT * FROM order_info WHERE orderId = ?", [orderId], function (error, results, fields) {
          if (error) throw error;
          if (results.length == 0) {
            //2、如果找不到订单号，则删除失败
            result = new Result(-1, '删除失败');
            //打印响应报文
            res.send(result);
          } else {
            conn.query("DELETE FROM order_info WHERE orderId = ?", [ orderId ], function (error, results, fields) {
              if (error) throw error;
              result = new Result(200, '删除成功');
              res.send(result);
            })
          }
        });
        conn.release();
      })
    } else {
      result = new Result(-1, '删除失败');
      res.send(result);
    }
  })

  module.exports = order_router;