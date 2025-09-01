// http: Node.js의 기본 HTTP 모듈
const http = require('http');

// const pool = require('../config/dbPool');
// ../config/dbPool.js 파일에 자신의 db 정보 기입

// 아두이노 명령을 전달할 라즈베리파이 서버의 IP 주소와 포트
const RASPBERRY_PI_IP = '자신의 라즈베리파이 서버 주소 및 포트 기입';
const RASPBERRY_PI_PORT = 1234;

// 아두이노 명령어를 라즈베리파이로 전달하는 함수
exports.sendCommandToArduino = async (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ status: 'error', message: 'The "command" field is required.' });
    }

    const postData = JSON.stringify({ command });

    const options = {
        hostname: RASPBERRY_PI_IP,
        port: RASPBERRY_PI_PORT,
        path: '/arduino-command',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const apiReq = http.request(options, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', async () => {
            try {
                const responseData = JSON.parse(data);
                res.status(apiRes.statusCode).json(responseData);
            } catch (error) {
                console.error('Error parsing response from Raspberry Pi:', error);
                res.status(500).json({ status: 'error', message: 'Invalid response from Raspberry Pi.' });
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error forwarding command to Raspberry Pi:', error.message);
        res.status(500).json({ status: 'error', message: 'Failed to communicate with Raspberry Pi.' });
    });

    apiReq.write(postData);
    apiReq.end();
};

// 라즈베리파이에서 온습도 센서 데이터를 가져오는 함수
exports.getSensorData = (req, res) => {
    const options = {
        hostname: RASPBERRY_PI_IP,
        port: RASPBERRY_PI_PORT,
        path: '/dht-sensor',
        method: 'GET',
    };

    const apiReq = http.request(options, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                res.status(apiRes.statusCode).json(responseData);
            } catch (error) {
                console.error('Error parsing response from Raspberry Pi:', error);
                res.status(500).json({ status: 'error', message: 'Invalid response from Raspberry Pi.' });
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error getting sensor data from Raspberry Pi:', error.message);
        res.status(500).json({ status: 'error', message: 'Failed to communicate with Raspberry Pi.' });
    });

    apiReq.end();
};

// 데이터베이스에서 온습도 history를 가져오는 함수
exports.getDHT11History = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 기본값 1
        const limit = parseInt(req.query.limit) || 10; // 기본값 10
        const offset = (page - 1) * limit;

        const query = `
            SELECT * FROM sensor_data
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(query, [limit, offset]);

        const totalQuery = `SELECT COUNT(*) AS count FROM sensor_data`;
        const [totalRows] = await pool.query(totalQuery);
        const totalCount = totalRows[0].count;

        res.status(200).json({
            data: rows,
            total: totalCount,
            page: page,
            limit: limit,
        });
    } catch (error) {
        console.error('Error fetching sensor data with pagination:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch sensor data.' });
    }
};

// 데이터베이스에서 에어컨 제어 history를 가져오는 함수
exports.getAirconHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 기본값 1
        const limit = parseInt(req.query.limit) || 10; // 기본값 10
        const offset = (page - 1) * limit;

        const query = `
            SELECT * FROM history
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(query, [limit, offset]);

        const totalQuery = `SELECT COUNT(*) AS count FROM history`;
        const [totalRows] = await pool.query(totalQuery);
        const totalCount = totalRows[0].count;

        res.status(200).json({
            data: rows,
            total: totalCount,
            page: page,
            limit: limit,
        });
    } catch (error) {
        console.error('Error fetching history data with pagination:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch aircon history.' });
    }
};
