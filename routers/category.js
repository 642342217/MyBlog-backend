const express = require('express');
const router = express.Router();

const handleCategory = require('../router_handlers/allCategory');

//获取所有文章目录
router.get('/getAllCategories', handleCategory.getAllCategory);

module.exports = router;