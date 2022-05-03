const express = require('express');
const path = require('path');
const cors = require('cors');
const parse = require('./handleMd/index');

const app = express();

//设置跨域
app.use(cors());

//读取文件，并存入数据库
parse();

// 处理出错中间件
app.use(function(req, res, next) {
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        });
    }

    next();
});

//获取所有文章信息
const articleRouter = require('./routers/allArticle');
app.use('/', articleRouter);

//获取目录列表
const categoryRouter = require('./routers/category');
app.use('/', categoryRouter);

//获取目录下相关文章信息
const relArticleRouter = require('./routers/relatedArticle');
app.use('/', relArticleRouter);


//监听端口
app.listen(0815, () => {
    console.log('api server running at http://127.0.0.1:0815');
})

