import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = '/api/arduino'; // vite.config.js에서 프록시 설정됨

// API Fetcher 함수들
// --------------------

/**
 * 실시간 센서 데이터를 가져옵니다.
 */
const fetchSensorData = async () => {
    const res = await fetch(`${API_BASE_URL}/dht-sensor`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message || 'Failed to fetch sensor data');
    return data;
};

/**
 * 히스토리 데이터를 (페이지네이션하여) 가져옵니다.
 * @param {string} apiPath - '/aircon-history' 또는 '/dht-history'
 * @param {number} page - 1부터 시작하는 페이지 번호
 * @param {number} limit - 페이지 당 아이템 수
 */
const fetchHistory = async (apiPath, page, limit = 10) => {
    const res = await fetch(`${apiPath}?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message || 'Failed to fetch history');
    return data;
};

/**
 * 아두이노로 명령어를 POST합니다.
 * @param {string} command - 'SEND 0,5'와 같은 명령어
 */
const postCommand = async (command) => {
    const res = await fetch(`${API_BASE_URL}/send-command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message || 'Failed to send command');
    return data;
};

// React Query 훅
// --------------------

/**
 * 실시간 온습도 센서 데이터를 위한 훅.
 * 5초마다 자동으로 데이터를 새로고침합니다.
 */
export const useSensorData = () => {
    return useQuery({
        queryKey: ['sensorData'],
        queryFn: fetchSensorData,
        refetchInterval: 5000, // 5초마다 자동 갱신
        staleTime: 1000,
    });
};

/**
 * 에어컨 제어 기록을 위한 훅 (페이지네이션 지원).
 * @param {number} page - 1부터 시작하는 페이지 번호
 * @param {number} rowsPerPage - 페이지 당 행 수
 */
export const useAirHistory = (page, rowsPerPage) => {
    return useQuery({
        queryKey: ['airHistory', page, rowsPerPage],
        queryFn: () => fetchHistory(`${API_BASE_URL}/aircon-history`, page, rowsPerPage),
        placeholderData: (previousData) => previousData, // 새 데이터 로드 중 이전 데이터 유지
    });
};

/**
 * 온습도 기록을 위한 훅 (페이지네이션 지원).
 * @param {number} page - 1부터 시작하는 페이지 번호
 * @param {number} rowsPerPage - 페이지 당 행 수
 */
export const useTempHistory = (page, rowsPerPage) => {
    return useQuery({
        queryKey: ['tempHistory', page, rowsPerPage],
        queryFn: () => fetchHistory(`${API_BASE_URL}/dht-history`, page, rowsPerPage),
        placeholderData: (previousData) => previousData,
    });
};

/**
 * 에어컨 명령어를 전송하기 위한 훅.
 * 성공 시 'airHistory' 쿼리를 무효화하여 기록을 자동 갱신합니다.
 */
export const useSendCommand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postCommand,
        onSuccess: () => {
            // 명령어 전송 성공 시, 에어컨 기록 캐시를 무효화하여 새로고침
            queryClient.invalidateQueries({ queryKey: ['airHistory'] });
        },
    });
};
