const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const userInfo_router = express.Router();
const { setQuerySql } = require('../util');

userInfo_router.get('/get/', (req, res) => {
    const params = req.query;
    const { currentPage, realName, userName, studentNumber, major, phoneNumber } = params;
    const queryParams = { realName, userName, studentNumber, major, phoneNumber }
    const { sql, paramsArr } = setQuerySql('SELECT * FROM user_info', queryParams)
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
          result = new Result(200, '获取用户信息成功', finalRes);
          res.send(result);
        });
        conn.release();
      })
  })

  userInfo_router.get('/update/', (req, res) => {
    const params = req.query;
    const { id, realName, userName, major, phoneNumber } = params;
    let result = new Result(-1, '');
    if (id && realName && userName && major && phoneNumber) {
      //1、查询数据库中是否已有相同用户名
      pool.getConnection((err, conn) => {
        conn.query("SELECT * FROM user_info WHERE userName = ?", [userName], function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            result = new Result(-1, '修改失败,已有相同用户名');
            //打印响应报文
            res.send(result);
          } else {
            conn.query("UPDATE user_info SET realName = ?, userName = ?, major = ?, phoneNumber = ? WHERE id = ?", [realName, userName, major, phoneNumber, id ], function (error, results, fields) {
              if (error) throw error;
              result = new Result(200, '修改成功');
              res.send(result);
            })
          }
        });
        conn.release();
      })
    } else {
      result = new Result(-1, '修改失败');
      res.send(result);
    }
  })

  module.exports = userInfo_router;