const db = require('../db/index');


// 获取所有文章信息
exports.getAllArticle = (req, res) => {
    const sql = 'select * from articles';

    db.query(sql, (err, results) => {
        if(err) {
            return res.cc(err);
        }

        res.send({
            status: 0,
            message: '获取文章信息成功！',
            data: results
        })
    })

}