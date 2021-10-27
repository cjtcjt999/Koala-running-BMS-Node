const { pool, Result } = require('../connect');
const express = require('express');//引入express模块
const login_router = express.Router();
login_router.post('/', (req, res) => {
  const params = req.body;
  const { userName, userPassword } = params;
  let result = new Result(-1, '');
  if (userName && userPassword) {
    //1、查询数据库中是否有用户名
    pool.getConnection((err, conn) => {
      conn.query("SELECT * FROM user_admin_info WHERE userName = ?", [userName], function (error, results, fields) {
        if (error) throw error;
        if (results.length >= 1) {
          //2、如果有用户名，查询密码是否相同
          if (userPassword == results[0].userPassword) {
            //3、密码相同则登陆成功
            const { id, userName, realName } = results[0];
            const data = { userId: id, userName, realName };
            result = new Result(200, '登录成功', data);
            res.send(result);
          } else {
            result = new Result(-1, '登录失败，用户名或密码不正确');
            res.send(result);
          }
        } else {
          result = new Result(-1, '登录失败，用户名或密码不正确');
          res.send(result);
        }
      });
      conn.release();
    })
  } else {
    result = new Result(-1, '登录失败，用户名或密码不能为空');
    res.send(result);
  }
})

module.exports = login_router;