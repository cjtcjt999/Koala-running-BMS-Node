const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const adminInfo_router = express.Router();
const { setQuerySql } = require('../util');

adminInfo_router.get('/get/', (req, res) => {
  const params = req.query;
  const { currentPage, realName, userName } = params;
  const queryParams = { realName, userName }
  const { sql, paramsArr } = setQuerySql('SELECT * FROM user_admin_info', queryParams)
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
        result = new Result(200, '获取管理员信息成功', finalRes);
        res.send(result);
      });
      conn.release();
    })
})

adminInfo_router.get('/add/', (req, res) => {
  const params = req.query;
    const { userName, userPassword, realName } = params;
    let result = new Result(-1, '');
    if (userName && userPassword && realName) {
      //1、查询数据库中是否有用户名
      pool.getConnection((err, conn) => {
        conn.query("SELECT * FROM user_admin_info WHERE userName = ?", [userName], function (error, results, fields) {
          if (error) throw error;
          if (results.length >= 1) {
            //2、如果有相同用户名，则添加失败，用户名重复
            result = new Result(-1, '添加失败，用户名已存在');
            //打印响应报文
            res.send(result);
          } else {
            conn.query("INSERT INTO user_admin_info(userName,userPassword,realName) VALUES(?,?,?)", [userName, userPassword, realName], function (error, results, fields) {
              if (error) throw error;
              //3、如果没有相同用户名，并且有一条记录，则添加成功
              if (results.affectedRows == 1) {
                result = new Result(200, '添加成功');
                res.send(result);
              } else {
                result = new Result(-1, '添加失败');
                res.send(result);
              }
            })
          }
        });
        conn.release();
      })
    } else {
      result = new Result(-1, '添加失败，信息不能为空');
      res.send(result);
    }
  })

  adminInfo_router.get('/update/', (req, res) => {
    const params = req.query;
    const { id, realName, userName, userPassword } = params;
    let result = new Result(-1, '');
    if (id && realName && userName && userPassword) {
      //1、查询数据库中是否已有相同用户名
      pool.getConnection((err, conn) => {
        conn.query("SELECT * FROM user_admin_info WHERE userName = ?", [userName], function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            result = new Result(-1, '修改失败,已有相同用户名');
            //打印响应报文
            res.send(result);
          } else {
            conn.query("UPDATE user_admin_info SET realName = ?, userName = ?, userPassword = ? WHERE id = ?", [realName, userName, userPassword, id ], function (error, results, fields) {
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

  adminInfo_router.get('/delete/', (req, res) => {
    const params = req.query;
    const { id } = params;
    let result = new Result(-1, '');
    if (id) {
      //1、查询数据库中是否有此id
      pool.getConnection((err, conn) => {
        conn.query("SELECT * FROM user_admin_info WHERE id = ?", [id], function (error, results, fields) {
          if (error) throw error;
          if (results.length == 0) {
            //2、如果找不到用户id，则删除失败
            result = new Result(-1, '删除失败');
            //打印响应报文
            res.send(result);
          } else {
            conn.query("DELETE FROM user_admin_info WHERE id = ?", [ id ], function (error, results, fields) {
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

module.exports = adminInfo_router;