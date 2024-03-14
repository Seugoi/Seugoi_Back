const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'seugoi'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류: ' + err.stack);
        return;
    } else {
        console.log('MySQL 연결 성공');
    }
});

db.connect();

module.exports = db;