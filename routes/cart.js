const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// 获取购物车列表

router.get('/', async (req, res) => {
    try {
        const [rows0] = await pool.execute(
            'SELECT * FROM users WHERE state = 1',
        );
        const [rows] = await pool.execute(
            'SELECT * FROM cart WHERE user_name = ? ',
            [rows0[0].name]
        );
        if (rows.length == 0) {
            const responseData = {
                code: 200,
                message: "获取购物车列表成功",
                data: {
                    products_incart_list: []
                }
            };
            res.json(responseData);
        }
        else {
            const responseData = {
                code: 200,
                message: "获取购物车列表成功",
                data: {
                    products_incart_list: rows.map(product => ({
                        name: product.product_name,
                        price: product.price,
                        quantity: product.number
                    }))
                }
            };
            res.json(responseData);
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 购物车商品结算

router.get('/payall', async (req, res) => {
    try {
        const [rows0] = await pool.execute(
            'SELECT * FROM users WHERE state = 1'
        );
        const user_name = rows0[0].name;
        const [rows] = await pool.execute(
            'SELECT * FROM cart WHERE user_name = ?',
            [user_name]
        );
        await pool.execute(
            // 清空购物车
            'DELETE from cart WHERE user_name = ?',
            [user_name]
        );

        function formatDate(date, msg) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            const second = String(date.getSeconds()).padStart(2, '0');
            if (msg === 1) return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            else return `${year}${month}${day}${hour}${minute}${second}`;
        }
        const now = new Date();
        const Time = formatDate(now, 1);
        const Time_str = formatDate(now, 0);

        let info = '';
        let sum_price = 0;
        for (let i = 0; i < rows.length; i++) {
            sum_price += rows[i].price;
            if (i === rows.length - 1) {
                info += rows[i].product_name + '×' + rows[i].number;
            } else {
                info += rows[i].product_name + '×' + rows[i].number + ' , ';
            }
        }

        await pool.execute(
            'INSERT INTO orders (id, price, user_name, time, state, info) VALUES (?, ?, ?, ?, ?, ?)',
            [Time_str, sum_price, user_name, Time, 0, info]
        );
        const responseData = {
            code: 200,
            message: "商品结算成功",
            data: {
                id: Time_str,
                info: info
            }
        };
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

// 清空购物车

router.get('/removeall', async (req, res) => {
    try {
        await pool.execute(
            'DELETE from cart'
        );
        res.status(200).json({ code: 200, message: "商品删除成功！" });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

module.exports = router;