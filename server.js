const { app, pool, Result } = require('./connect');
const http = require('http');
const https = require('https');
const fs = require('fs');
const login = require('./login/index');
const adminInfo = require('./personInfo/adminInfo');
const userInfo = require('./personInfo/userInfo');
const orderInfo = require('./order/order');
const addressInfo = require('./address/index');
const feedback = require('./feedback/index');

const options = {
  key: fs.readFileSync('./SSL/4998241_chayuanshiyi.cn.key'),
  cert: fs.readFileSync('./SSL/4998241_chayuanshiyi.cn.pem')
}

app.all('*',(req,res,next) => {
  //这里处理全局拦截，一定要写在最上面，不然会被别的接口匹配而没有执行next导致捕捉不到
  next();
})

app.get('/', (req, res) => {
    return res.json(new Result({ data: 'Hello World！' }))
})

app.use('/admin/login', login);
app.use('/admin/adminInfo', adminInfo);
app.use('/admin/userInfo', userInfo);
app.use('/admin/orderInfo', orderInfo);
app.use('/admin/addressInfo', addressInfo);
app.use('/admin/feedback', feedback);

//定义端口，此处所用为3088端口，可自行更改
http.createServer(app).listen(3088, function () {
  console.log('runing 3088...');
});
https.createServer(options, app).listen(4088, function () {
  console.log('runing 4088...');
});

