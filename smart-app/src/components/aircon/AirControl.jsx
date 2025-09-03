import { useState } from 'react';
import axios from 'axios';

// Node.js 서버 URL을 여기에 설정합니다.
// React 앱이 Node.js 서버와 같은 컴퓨터에서 실행된다고 가정합니다.
const NODE_JS_SERVER_URL = 'http://localhost:6677/api/arduino';

// API 요청을 처리하는 함수
const sendCommandToArduino = async (command) => {
    try {
        const response = await axios.post(`${NODE_JS_SERVER_URL}/send-command`, {
            command: command,
        });
        return response.data;
    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
};

const getCommandIndex = (type, temp, wind) => {
    const codes = [
        { type: 'power', code: '0' },
        { type: 'powerOn', code: '1' },
        { type: 'powerCooling', code: '2' },
        { type: 'cooling', wind: '약풍', temp: 18, code: '3' },
        { type: 'cooling', wind: '약풍', temp: 19, code: '4' },
        { type: 'cooling', wind: '약풍', temp: 20, code: '5' },
        { type: 'cooling', wind: '약풍', temp: 21, code: '6' },
        { type: 'cooling', wind: '약풍', temp: 22, code: '7' },
        { type: 'cooling', wind: '약풍', temp: 23, code: '8' },
        { type: 'cooling', wind: '약풍', temp: 24, code: '9' },
        { type: 'cooling', wind: '약풍', temp: 25, code: '10' },
        { type: 'cooling', wind: '약풍', temp: 26, code: '11' },
        { type: 'cooling', wind: '약풍', temp: 27, code: '12' },
        { type: 'cooling', wind: '약풍', temp: 28, code: '13' },
        { type: 'cooling', wind: '약풍', temp: 29, code: '14' },
        { type: 'cooling', wind: '약풍', temp: 30, code: '15' },
        { type: 'cooling', wind: '중풍', temp: 18, code: '16' },
        { type: 'cooling', wind: '중풍', temp: 19, code: '17' },
        { type: 'cooling', wind: '중풍', temp: 20, code: '18' },
        { type: 'cooling', wind: '중풍', temp: 21, code: '19' },
        { type: 'cooling', wind: '중풍', temp: 22, code: '20' },
        { type: 'cooling', wind: '중풍', temp: 23, code: '21' },
        { type: 'cooling', wind: '중풍', temp: 24, code: '22' },
        { type: 'cooling', wind: '중풍', temp: 25, code: '23' },
        { type: 'cooling', wind: '중풍', temp: 26, code: '24' },
        { type: 'cooling', wind: '중풍', temp: 27, code: '25' },
        { type: 'cooling', wind: '중풍', temp: 28, code: '26' },
        { type: 'cooling', wind: '중풍', temp: 29, code: '27' },
        { type: 'cooling', wind: '중풍', temp: 30, code: '28' },
        { type: 'cooling', wind: '강풍', temp: 18, code: '29' },
        { type: 'cooling', wind: '강풍', temp: 19, code: '30' },
        { type: 'cooling', wind: '강풍', temp: 20, code: '31' },
        { type: 'cooling', wind: '강풍', temp: 21, code: '32' },
        { type: 'cooling', wind: '강풍', temp: 22, code: '33' },
        { type: 'cooling', wind: '강풍', temp: 23, code: '34' },
        { type: 'cooling', wind: '강풍', temp: 24, code: '35' },
        { type: 'cooling', wind: '강풍', temp: 25, code: '36' },
        { type: 'cooling', wind: '강풍', temp: 26, code: '37' },
        { type: 'cooling', wind: '강풍', temp: 27, code: '38' },
        { type: 'cooling', wind: '강풍', temp: 28, code: '39' },
        { type: 'cooling', wind: '강풍', temp: 29, code: '40' },
        { type: 'cooling', wind: '강풍', temp: 30, code: '41' },
        { type: 'cooling', wind: '자동풍', temp: 18, code: '42' },
        { type: 'cooling', wind: '자동풍', temp: 19, code: '43' },
        { type: 'cooling', wind: '자동풍', temp: 20, code: '44' },
        { type: 'cooling', wind: '자동풍', temp: 21, code: '45' },
        { type: 'cooling', wind: '자동풍', temp: 22, code: '46' },
        { type: 'cooling', wind: '자동풍', temp: 23, code: '47' },
        { type: 'cooling', wind: '자동풍', temp: 24, code: '48' },
        { type: 'cooling', wind: '자동풍', temp: 25, code: '49' },
        { type: 'cooling', wind: '자동풍', temp: 26, code: '50' },
        { type: 'cooling', wind: '자동풍', temp: 27, code: '51' },
        { type: 'cooling', wind: '자동풍', temp: 28, code: '52' },
        { type: 'cooling', wind: '자동풍', temp: 29, code: '53' },
        { type: 'cooling', wind: '자동풍', temp: 30, code: '54' },
        { type: 'dehumidification', wind: '약풍', temp: 18, code: '55' },
        { type: 'dehumidification', wind: '약풍', temp: 19, code: '56' },
        { type: 'dehumidification', wind: '약풍', temp: 20, code: '57' },
        { type: 'dehumidification', wind: '약풍', temp: 21, code: '58' },
        { type: 'dehumidification', wind: '약풍', temp: 22, code: '59' },
        { type: 'dehumidification', wind: '약풍', temp: 23, code: '60' },
        { type: 'dehumidification', wind: '약풍', temp: 24, code: '61' },
        { type: 'dehumidification', wind: '약풍', temp: 25, code: '62' },
        { type: 'dehumidification', wind: '약풍', temp: 26, code: '63' },
        { type: 'dehumidification', wind: '약풍', temp: 27, code: '64' },
        { type: 'dehumidification', wind: '약풍', temp: 28, code: '65' },
        { type: 'dehumidification', wind: '약풍', temp: 29, code: '66' },
        { type: 'dehumidification', wind: '약풍', temp: 30, code: '67' },
        { type: 'dehumidification', wind: '중풍', temp: 18, code: '68' },
        { type: 'dehumidification', wind: '중풍', temp: 19, code: '69' },
        { type: 'dehumidification', wind: '중풍', temp: 20, code: '70' },
        { type: 'dehumidification', wind: '중풍', temp: 21, code: '71' },
        { type: 'dehumidification', wind: '중풍', temp: 22, code: '72' },
        { type: 'dehumidification', wind: '중풍', temp: 23, code: '73' },
        { type: 'dehumidification', wind: '중풍', temp: 24, code: '74' },
        { type: 'dehumidification', wind: '중풍', temp: 25, code: '75' },
        { type: 'dehumidification', wind: '중풍', temp: 26, code: '76' },
        { type: 'dehumidification', wind: '중풍', temp: 27, code: '77' },
        { type: 'dehumidification', wind: '중풍', temp: 28, code: '78' },
        { type: 'dehumidification', wind: '중풍', temp: 29, code: '79' },
        { type: 'dehumidification', wind: '중풍', temp: 30, code: '80' },
        { type: 'dehumidification', wind: '강풍', temp: 18, code: '81' },
        { type: 'dehumidification', wind: '강풍', temp: 19, code: '82' },
        { type: 'dehumidification', wind: '강풍', temp: 20, code: '83' },
        { type: 'dehumidification', wind: '강풍', temp: 21, code: '84' },
        { type: 'dehumidification', wind: '강풍', temp: 22, code: '85' },
        { type: 'dehumidification', wind: '강풍', temp: 23, code: '86' },
        { type: 'dehumidification', wind: '강풍', temp: 24, code: '87' },
        { type: 'dehumidification', wind: '강풍', temp: 25, code: '88' },
        { type: 'dehumidification', wind: '강풍', temp: 26, code: '89' },
        { type: 'dehumidification', wind: '강풍', temp: 27, code: '90' },
        { type: 'dehumidification', wind: '강풍', temp: 28, code: '91' },
        { type: 'dehumidification', wind: '강풍', temp: 29, code: '92' },
        { type: 'dehumidification', wind: '강풍', temp: 30, code: '93' },
        { type: 'dehumidification', wind: '자동풍', temp: 18, code: '94' },
        { type: 'dehumidification', wind: '자동풍', temp: 19, code: '95' },
        { type: 'dehumidification', wind: '자동풍', temp: 20, code: '96' },
        { type: 'dehumidification', wind: '자동풍', temp: 21, code: '97' },
        { type: 'dehumidification', wind: '자동풍', temp: 22, code: '98' },
        { type: 'dehumidification', wind: '자동풍', temp: 23, code: '99' },
        { type: 'dehumidification', wind: '자동풍', temp: 24, code: '100' },
        { type: 'dehumidification', wind: '자동풍', temp: 25, code: '101' },
        { type: 'dehumidification', wind: '자동풍', temp: 26, code: '102' },
        { type: 'dehumidification', wind: '자동풍', temp: 27, code: '103' },
        { type: 'dehumidification', wind: '자동풍', temp: 28, code: '104' },
        { type: 'dehumidification', wind: '자동풍', temp: 29, code: '105' },
        { type: 'dehumidification', wind: '자동풍', temp: 30, code: '106' },
    ];
    const foundCode = codes.find((c) => c.type === type && c.temp === temp && c.wind === wind);
    return foundCode ? foundCode.code : null;
};

export default function AirControl() {
    const [type, setType] = useState('cooling');
    const [temp, setTemp] = useState(18);
    const [wind, setWind] = useState('약풍');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCommand = async (commandType) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        let commandToSend;

        if (commandType === 'powerCooling') {
            commandToSend = 'SEND 2,5';
        } else if (commandType === 'powerOff') {
            commandToSend = 'SEND 0,5';
        } else if (commandType === 'powerOn') {
            // 전원 켜기 버튼 추가
            commandToSend = 'SEND 1,5';
        } else {
            const codeIndex = getCommandIndex(type, temp, wind);
            if (codeIndex !== null) {
                commandToSend = `SEND ${codeIndex},5`;
            } else {
                setError('유효하지 않은 명령어 조합입니다.');
                setLoading(false);
                return;
            }
        }

        try {
            const apiResponse = await sendCommandToArduino(commandToSend);
            setResponse(apiResponse);
        } catch (err) {
            setError(`명령 전송에 실패했습니다: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const temps = Array.from({ length: 13 }, (_, i) => 18 + i);
    const winds = ['약풍', '중풍', '강풍', '자동풍'];

    return (
        <div className="container">
            <div className="row my-5">
                <div className="col-md-8 offset-md-2 col-sm-10 offset-md-1">
                    <h1 className="text-center">에어컨 제어</h1>
                    <div className="card my-4 p-4">
                        <h5 className="card-title">단축 명령어</h5>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleCommand('powerOn')} // 전원 켜기 버튼 추가
                                disabled={loading}
                            >
                                전원 ON
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleCommand('powerCooling')}
                                disabled={loading}
                            >
                                파워 냉방
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleCommand('powerOff')}
                                disabled={loading}
                            >
                                전원 OFF
                            </button>
                        </div>
                    </div>
                    <div className="card my-4 p-4">
                        <h5 className="card-title">명령어 전송</h5>
                        <div className="mb-3">
                            <label htmlFor="type-select" className="form-label">
                                종류:
                            </label>
                            <select
                                id="type-select"
                                className="form-select"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="cooling">냉방</option>
                                <option value="dehumidification">제습</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="temp-select" className="form-label">
                                온도:
                            </label>
                            <select
                                id="temp-select"
                                className="form-select"
                                value={temp}
                                onChange={(e) => setTemp(parseInt(e.target.value))}
                            >
                                {temps.map((t) => (
                                    <option key={t} value={t}>
                                        {t}℃
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="wind-select" className="form-label">
                                바람 세기:
                            </label>
                            <select
                                id="wind-select"
                                className="form-select"
                                value={wind}
                                onChange={(e) => setWind(e.target.value)}
                            >
                                {winds.map((w) => (
                                    <option key={w} value={w}>
                                        {w}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="btn btn-primary w-100"
                            onClick={() => handleCommand('custom')}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>{' '}
                                    전송 중...
                                </>
                            ) : (
                                '명령 전송'
                            )}
                        </button>
                    </div>

                    {loading && (
                        <div className="alert alert-info" role="alert">
                            명령어를 전송하고 있습니다. 잠시만 기다려 주세요...
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            오류: {error}
                        </div>
                    )}

                    {response && (
                        <div className="alert alert-success" role="alert">
                            <strong>성공!</strong> <br />
                            <strong>서버 메시지:</strong> {response.message} <br />
                            <strong>아두이노 응답:</strong> {response.arduinoResponse}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
