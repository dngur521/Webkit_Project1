const express = require('express');
const router = express.Router();
const arduinoController = require('../controllers/arduinoController');

// '/send-command' 엔드포인트를 POST 요청에 연결
router.post('/send-command', arduinoController.sendCommandToArduino);

// '/dht-sensor' 엔드포인트를 GET 요청에 연결
router.get('/dht-sensor', arduinoController.getSensorData);

// 에어컨 제어 기록을 데이터베이스에서 가져오는 엔드포인트
router.get('/aircon-history', arduinoController.getAirconHistory);

// 온습도 기록을 데이터베이스에서 가져오는 엔드포인트
router.get('/dht-history', arduinoController.getDHT11History);

module.exports = router;
