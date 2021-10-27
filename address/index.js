const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const address_router = express.Router();
const { setQuerySql } = require('../util');

address_router.get('/get/', (req, res) => {
  const params = req.query;
  const { currentPage, realName, userName, contacts, contactsPhone } = params;
  const queryParams = { realName, userName, contacts, contactsPhone }
  const { sql, paramsArr } = setQuerySql('SELECT * FROM address_info', queryParams)
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
        result = new Result(200, '获取地址信息成功', finalRes);
        res.send(result);
      });
      conn.release();
    })
})

  address_router.get('/update/', (req, res) => {
    const params = req.query;
    const { id, address, contacts, contactsPhone } = params;
    let result = new Result(-1, '');
    if (id) {
      pool.getConnection((err, conn) => {
        conn.query("UPDATE address_info SET address = ?, contacts = ?, contactsPhone = ? WHERE id = ?", [address, contacts, contactsPhone, id ], function (error, results, fields) {
          if (error) throw error;
          result = new Result(200, '修改成功');
          res.send(result);
        })
        conn.release();
      })
    } else {
      result = new Result(-1, '修改失败');
      res.send(result);
    }
  })

  address_router.get('/delete/', (req, res) => {
    const params = req.query;
    const { id } = params;
    let result = new Result(-1, '');
    if (id) {
      //1、查询数据库中是否有此id
      pool.getConnection((err, conn) => {
        conn.query("SELECT * FROM address_info WHERE id = ?", [id], function (error, results, fields) {
          if (error) throw error;
          if (results.length == 0) {
            //2、如果找不到地址id，则删除失败
            result = new Result(-1, '删除失败');
            //打印响应报文
            res.send(result);
          } else {
            conn.query("DELETE FROM address_info WHERE id = ?", [ id ], function (error, results, fields) {
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

module.exports = address_router;