const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// 获取订单列表

router.get('/', async (req, res) => {
    try {
        const [rows0] = await pool.execute(
            'SELECT * FROM users WHERE state = 1'
        );
        const user_name = rows0[0].name;
        const [rows] = await pool.execute(
            'SELECT * FROM orders WHERE user_name = ?',
            [user_name]
        );
        if (rows.length == 0) {
            const responseData = {
                code: 200,
                message: "获取订单列表成功",
                data: {
                    products_inorders_list: []
                }
            };
            res.json(responseData);
        }
        else {
            const responseData = {
                code: 200,
                message: "获取订单列表成功",
                data: {
                    products_inorders_list: rows.map(product => ({
                        id: product.id,
                        user_name: product.user_name,
                        price: product.price,
                        time: product.time,
                        state: product.state,
                        info: product.info
                    }))
                }
            };
            res.json(responseData);
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 退款

router.post('/remove-from-orders', async (req, res) => {
    try {
        const { id } = req.body;
        await pool.execute(
            'DELETE FROM orders WHERE id = ?',
            [id]
        );
        res.status(200).json({ code: 200, message: '退款成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 确认收货

router.post('/sure', async (req, res) => {
    try {
        const { id } = req.body;
        await pool.execute(
            'DELETE FROM orders WHERE id = ?',
            [id]
        );
        res.status(200).json({ code: 200, message: '确认收货成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

module.exports = router;