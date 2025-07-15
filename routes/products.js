const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const path = require('path');


// 跳转到主页

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../views', '/basic.html'));
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 跳转到商品详情页面

router.get('/:productId', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../views', '/detail.html'));
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 获取商品详情

router.get('/details/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const [rows] = await pool.execute(
            'SELECT * FROM details WHERE id= ?',
            [productId]
        );
        const responseData = {
            code: 200,
            message: "获取商品详情成功",
            data: {
                id: rows[0].id,
                product_name: rows[0].product_name,
                price: rows[0].price,
                info:rows[0].info
            }
        };
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
        console.log(error.message);
    }
});


// 获取商品评论

router.get('/comments/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const [rows] = await pool.execute(
            'SELECT * FROM comments WHERE product_id= ?',
            [productId]
        );
        const responseData = {
            code: 200,
            message: "获取商品评价列表成功",
            data:{
                comments_list: rows.map(comment => ({
                    user_name: comment.user_name,
                    time: comment.time,
                    avatar_id: comment.avatar_id,
                    info: comment.info
                }))
            }   
        };
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
        console.log(error.message);
    }
});


// 添加商品到购物车

router.post('/add-to-cart', async (req, res) => {
    const { id, product_name, price } = req.body;
    try {
        const [r1] = await pool.execute(
            'SELECT * FROM cart WHERE id= ?',
            [id]
        );
        if (r1.length == 0) {
            // 购物车没有该商品的情况 
            const [r2] = await pool.execute(
                'SELECT name FROM users WHERE state= 1',
            );
            await pool.execute('INSERT INTO cart (id, product_name, price, number, user_name) VALUES (?, ?, ?, ?, ?)',
                [id, product_name, price, 1,r2[0].name]
            )    
        }
        else {
            // 购物车已有该商品的情况（商品数量加1）
            await pool.execute(
                'UPDATE cart SET number = ? WHERE id = ?',
                [r1[0].number+1, id]
            )
        }
        res.status(200).json({ code: 200, message: '加入购物车成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


// 添加商品评论

router.post('/comment-handle', async (req, res) => {
    const { product_id, time, info } = req.body;
    try {
        const [r1] = await pool.execute(
            'SELECT * FROM users WHERE state = 1',
        );
        const user_name = r1[0].name;
        const avatar_id = r1[0].avatar_id;
        await pool.execute(
            'INSERT INTO comments (product_id, user_name, time, avatar_id, info) VALUES (?, ?, ?, ?, ?)',
            [product_id, user_name, time, avatar_id, info]
        )
        res.status(200).json({ code: 200, message: '发布评论成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

module.exports = router;