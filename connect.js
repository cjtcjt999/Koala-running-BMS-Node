const express = require('express');//引入express模块
const mysql = require('mysql');
const bodyParser = require('body-parser');//解析参数
const cors = require('cors');
const app = express();
const option = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'xypt',
  connectTimeout: 5000,//连接超时
  multipleStatements: false//是否允许一个query中包含多条sql语句
}
app.use(cors());//解决跨域
app.use(bodyParser.json());//json请求
app.use(bodyParser.urlencoded({extended:false}));//表单请求

let pool;
repool();

function Result( code = 200, msg = '', data = {} ){
  this.code = code;
  this.msg = msg;
  this.data = data;
}

function repool() {//断线重连机制
  pool = mysql.createPool({
    ...option,
    waitForConnections:true,//当无连接池可用时，等待(true)还是抛错(false)
    connectionLimit:100,//连接数限制
    queueLimit:0//最大连接等待数(0为不限制)
  });//创立连接池
  pool.on('error', err => err.code === 'PROTOCOL_CONNECTION_LOST' && setTimeout(repool, 2000));
  // app.all('*',(_,__,next) => pool.getConnection(err => err && setTimeout(repool,2000) || next()));
}

module.exports = { pool, Result, app };