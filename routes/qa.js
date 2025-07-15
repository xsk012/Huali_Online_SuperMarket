const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const path = require('path');


// 页面跳转

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../views', 'qa.html'));
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message } );
    }
});

module.exports = router;