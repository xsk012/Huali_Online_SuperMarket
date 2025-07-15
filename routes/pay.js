const express = require('express');
const router = express.Router();
const path = require('path');

// 跳转到支付界面
router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../views', '/pay.html'));
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
        console.log(error.message);
    }
});

module.exports = router;