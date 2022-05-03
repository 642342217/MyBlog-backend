// 获取目录下相关文章信息

const express = require('express');
const router = express.Router();

const handleArticle = require('../router_handlers/allRelatedArticle');

router.get('/getRelArticles', handleArticle.getAllRelArticle);

module.exports = router;