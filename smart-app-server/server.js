// server.js
const express = require('express');
require('dotenv').config();
// npm i dotenv morgan
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// 라우터 가져오기
const arduinoRouter = require('./src/routes/arduinoRouter');

const port = process.env.PORT || 6677;
console.log('port: ', port);

const app = express();
// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cors()); //react와 통신시 필요함

// 라우터와 연결
app.use('/api/arduino', arduinoRouter);

// 빌드된 리액트 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'build')));

// 모든 요청을 React의 index.html로 리디렉션
// API 라우트 외의 모든 GET 요청을 React 앱으로 전달합니다.
app.get((req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
