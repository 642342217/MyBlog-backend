const express = require('express');
const cors = require('cors');
const parse = require('./handleMd/index');

const app = express();

//设置跨域
app.use(cors());

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

//读取文件，并存入数据库
parse();
parse();

//获取所有文章信息路由设置
const articleRouter = require('./routers/allArticle');
app.use('/', articleRouter);

//获取目录列表路由设置
const categoryRouter = require('./routers/category');
app.use('/', categoryRouter);

//获取目录下相关文章信息路由设置
const relArticleRouter = require('./routers/relatedArticle');
app.use('/', relArticleRouter);


//监听端口
app.listen(0815, () => {
    console.log('api server running at http://127.0.0.1:0815');
})

