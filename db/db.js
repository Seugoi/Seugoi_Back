const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'seugoi_user'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류: ' + err.stack);
        return;
    } else {
        console.log('MySQL 연결 성공');
    }
});

db.end();

module.exports = db;