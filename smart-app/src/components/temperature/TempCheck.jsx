import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TempCheck() {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const NODE_JS_SERVER_URL = '/api/arduino';

    const fetchData = async () => {
        try {
            const response = await axios.get(`${NODE_JS_SERVER_URL}/dht-sensor`);
            const data = response.data;

            if (data.status === 'success') {
                setTemperature(data.temperature);
                setHumidity(data.humidity);
                setError(null);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch data from server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // 컴포넌트가 처음 마운트될 때 한 번 실행

        const interval = setInterval(() => {
            fetchData();
        }, 5000); // 5초마다 API 호출

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);

    return (
        <div className="container mt-5">
            <div className="row my-4">
                <div className="col-md-8 offset-md-2 col-sm-10 offset-md-1">
                    <h1 className="text-center">실시간 온도 확인</h1>
                </div>
            </div>
            <div className="row my-4 justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card text-center shadow-lg border-0 rounded-3">
                        <div className="card-body">
                            {loading ? (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger" role="alert">
                                    오류: {error}
                                </div>
                            ) : (
                                <>
                                    <h5 className="card-title text-muted mb-3">현재 상태</h5>
                                    <div className="d-flex justify-content-around">
                                        <div className="p-2">
                                            <h3 className="text-primary mb-0">
                                                {temperature !== null ? `${temperature}°C` : '-'}
                                            </h3>
                                            <p className="text-muted small">온도</p>
                                        </div>
                                        <div className="p-2">
                                            <h3 className="text-info mb-0">
                                                {humidity !== null ? `${humidity}%` : '-'}
                                            </h3>
                                            <p className="text-muted small">습도</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
