const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const path = require('path');


// 页面跳转

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../views', 'personal_page.html'));
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message } );
    }
});


// 获取当前已登录用户信息

router.get('/info', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE state = 1',
        );
        if (rows.length == 0) {
            res.status(400).send('没有用户登录!');
        }
        else {
            const responseData = {
                code: 200,
                message: "获取用户信息成功",
                data: {
                    name: rows[0].name,
                    phone: rows[0].phone,
                    password: rows[0].password,
                    description: rows[0].dscb,
                    avatar_id: rows[0].avatar_id
                }
            };
            res.json(responseData);
        }

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 修改个人简介

router.post('/alter_info', async (req, res) => {
    try {
        const { introduction } = req.body;
        const safeinfo = introduction??null; 
        await pool.execute(
            'UPDATE users SET dscb = ? WHERE state = 1',
            [safeinfo]
        );
        res.status(200).json({ code: 200, message: '修改成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 修改头像

router.post('/alter_avatar', async (req, res) => {
    try {
        const { avatar_id } = req.body; 
        await pool.execute(
            'UPDATE users SET avatar_id = ? WHERE state = 1',
            [avatar_id]
        );
        res.status(200).json({ code: 200, message: '修改成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 退出登录

router.get('/log_out', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE state = 1',
        );
        if (rows.length == 0) {
            res.status(400).json({ code: 400, message: '没有用户登录！' });
        }
        else {
            await pool.execute('UPDATE users SET state = 0 WHERE state = 1',);
            res.status(200).json({ code: 200, message: '退出登录成功！' });
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

module.exports = router;
