const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const path = require('path');


// 页面跳转

router.get('/', async (req, res) => {
    try{
        res.sendFile(path.join(__dirname, '../views', 'login_basic.html'));
    } catch(error) {
        res.status(500).json({ code: 500, message: '页面跳转失败' });
    }
})


// 登录

router.post('/2', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE phone = ?',
            [phone]
        );
        
        if (rows.length == 0) {
            res.status(400).json({ code: 400, message: '用户不存在，请注册！' });
        }
        else if (rows[0].phone == phone && rows[0].password == password) {
            await pool.execute(
                'UPDATE users SET state = 1 WHERE phone = ?',
                [phone]
            );
            res.status(200).json({ code: 200, message: '登录成功!' });
        }
        else {
            res.status(400).json({ code: 400, message: '密码错误!' }); 
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: '登录失败' });
        console.log(error);
    }
});


// 注册
router.post('/1', async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const [rows1] = await pool.execute(
            'SELECT * FROM users WHERE name = ?',
            [name]
        );
        const [rows2] = await pool.execute(
            'SELECT * FROM users WHERE phone = ?',
            [phone]
        );

        if (rows1.length !== 0 || rows2.length !== 0) {
            res.json({ code: 400, message: '用户已经存在！' });
        }
        else if (phone < 10000000000 || phone > 20000000000 || phone.toString()[0] !== '1') {
            res.json({ code: 400, message: '电话号码不合法!' });
        }
        else if (password.length>8) {
            res.json({ code: 400, message: '密码不得多于八位!' });
        }
        else {
            const dscb = '暂无简介，点击添加个人信息~';
            await pool.execute(
                'INSERT INTO users (name, phone, password, avatar_id, dscb, state) VALUES (?, ?, ?, 0, ?, 1)',
                [name, phone, password, dscb]
            );
            res.status(200).json({ code: 200, message: '注册成功!' });
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

module.exports = router;