const express = require('express');
const router = express.Router();
const arduinoController = require('../controllers/arduinoController');

// '/send-command' 엔드포인트를 POST 요청에 연결
router.post('/send-command', arduinoController.sendCommandToArduino);

// '/dht-sensor' 엔드포인트를 GET 요청에 연결
router.get('/dht-sensor', arduinoController.getSensorData);

module.exports = router;
