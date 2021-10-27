const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const feedback_router = express.Router();
const { setQuerySql } = require('../util');

feedback_router.get('/get/', (req, res) => {
    const params = req.query;
    const { currentPage, realName, userName } = params;
    const queryParams = { realName, userName }
    const { sql, paramsArr } = setQuerySql('SELECT * FROM user_feedback', queryParams)
    let result = new Result(-1, '');
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
          result = new Result(200, '获取反馈信息成功', finalRes);
          res.send(result);
        });
        conn.release();
      })
  })

  feedback_router.get('/delete/', (req, res) => {
    const params = req.query;
    const { id } = params;
    let result = new Result(-1, '');
    if (id) {
      //1、查询数据库中是否有此id
      pool.getConnection((err, conn) => {
        conn.query("SELECT * FROM user_feedback WHERE id = ?", [id], function (error, results, fields) {
          if (error) throw error;
          if (results.length == 0) {
            //2、如果找不到反馈信息id，则删除失败
            result = new Result(-1, '删除失败');
            //打印响应报文
            res.send(result);
          } else {
            conn.query("DELETE FROM user_feedback WHERE id = ?", [ id ], function (error, results, fields) {
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

  module.exports = feedback_router;