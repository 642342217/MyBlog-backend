const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'chj000815',
    database: 'myblog'
});

module.exports = db;