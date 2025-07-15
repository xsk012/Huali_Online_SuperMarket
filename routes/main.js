const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// 最初的页面跳转

router.get('/',async(req,res)=>{
    try{
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE state=1'
        );
        if(rows.length==0)
        {
            res.redirect('/login/');
        }
        else
        {
            res.redirect("/products/");
        }
    } catch(error){
        res.status(500).json({ code: 500, message: error.message });
    }
});

module.exports=router;