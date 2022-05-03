// 获取所有文章的基本信息

const express = require('express');
const router = express.Router();

const handleArticle = require('../router_handlers/allArticle');

router.get('/getAllArticles', handleArticle.getAllArticle);

module.exports = router;