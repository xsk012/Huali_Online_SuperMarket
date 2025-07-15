const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.static('css'));
app.set('view engine', 'ejs');

// 路由
app.use('/', require('./routes/main'));
app.use('/login', require('./routes/login'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/user', require('./routes/user'));
app.use('/orders', require('./routes/orders'));
app.use('/pay', require('./routes/pay'));
app.use('/qa', require('./routes/qa'));

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});

// 没有数据库，服务器将无法开启，并且html页面将无法正常显示