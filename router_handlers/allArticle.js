const db = require('../db/index');


// 获取所有文章信息
exports.getAllArticle = (req, res) => {
    const sql = 'select id, title, date, category from article';

    db.query(sql, (err, results) => {
        if(err) {
            res.cc(err);
        }

        res.send({
            status: 0,
            message: '获取文章信息成功！',
            data: results
        })
    })

}