const express = require('express');
const path = require('path');
const cors = require('cors');

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

//获取所有文章信息
const articleRouter = require('./routers/allArticle');
app.use('/', articleRouter);

app.listen(0815, () => {
    console.log('api server running at http://127.0.0.1:0815');
})

