const db = require('../db/index');

//获取所有相关的文章
exports.getAllRelArticle = function(req, res) {
    const search = req.query.cate;

    const sql = `select title from articles where category=\'${search}\'`;

    db.query(sql, (err, results) => {
        if(err) {
            return res.cc(err);
        }

        res.send({
            status: 0,
            message: '获取该目录下所有文章成功！',
            data: results
        });
    })
}