const db = require('../db/index');

//获取所有的目录
exports.getAllCategory = (req, res) => {
    const sql = 'select * from categories';

    db.query(sql, (err, results) => {
        if(err) {
            return res.cc(err);
        }

        res.send({
            status: 0,
            message: '获取文章目录成功！',
            data: results
        });
    }); 
}
