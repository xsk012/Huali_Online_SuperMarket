const mysql = require('mysql2/promise');

// 创建数据库连接
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'online_supermarket',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

// 没有数据库，服务器将无法开启，并且html页面将无法正常显示