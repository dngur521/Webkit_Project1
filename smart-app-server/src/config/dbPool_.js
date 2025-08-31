const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'ip주소 입력',
    port: '포트번호 입력',
    user: 'user 입력',
    password: '비밀번호 입력',
    database: '데이터베이스 입력',
    connectionLimit: 10,
    waitForConnections: true,
});

module.exports = pool;
