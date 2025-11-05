import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import axios from 'axios';

const API_BASE_URL = '/api/arduino';

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
 * 아두이노로 명령어를 POST합니다. (토큰 인증이 필요하다고 가정하고 authApi 사용으로 변경)
 * @param {string} command - 'SEND 0,5'와 같은 명령어
 * @param {object} authApi - useAuth에서 가져온 인증된 Axios 인스턴스
 */
const postCommand = async ({ command, authApi }) => {
    // 토큰이 자동으로 헤더에 추가됩니다.
    const res = await authApi.post(`${API_BASE_URL}/send-command`, { command });
    const data = res.data;
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
 * 에어컨 명령어를 전송하기 위한 훅. (authApi 사용하도록 수정)
 */
export const useSendCommand = () => {
    const queryClient = useQueryClient();
    const { authApi } = useAuth(); // authApi 인스턴스를 가져옵니다.

    return useMutation({
        // mutationFn에 authApi를 인자로 넘겨줍니다.
        mutationFn: (command) => postCommand({ command, authApi }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['airHistory'] });
        },
    });
};

// 4. 인증 관련 API Hook 추가
// --------------------

/**
 * 로그인 훅
 */
export const useLogin = () => {
    const { setTokens, fetchUserProfile } = useAuth();

    return useMutation({
        mutationFn: async ({ username, password }) => {
            const res = await axios.post('/api/auth/login', { username, password });
            return res.data;
        },
        onSuccess: (data) => {
            setTokens(data.access_token, data.refresh_token);
            fetchUserProfile(); // 토큰 저장 후 사용자 정보 로드
        },
    });
};

/**
 * 회원가입 훅
 */
export const useRegister = () => {
    return useMutation({
        mutationFn: async ({ username, password }) => {
            const res = await axios.post('/api/auth/register', { username, password });
            return res.data;
        },
    });
};

/**
 * 로그아웃 훅
 */
export const useLogout = () => {
    const { removeTokens } = useAuth();

    return useMutation({
        mutationFn: async () => {
            const refreshToken = localStorage.getItem('refresh_token');
            // 서버에 Refresh Token 무효화 요청 (클라이언트에서도 토큰 삭제)
            await axios.post('/api/auth/logout', { refresh_token: refreshToken });
        },
        onSuccess: () => {
            removeTokens();
        },
        onError: () => {
            // 서버 측 로그아웃 실패 시에도 클라이언트 토큰은 삭제
            removeTokens();
        },
    });
};

/**
 * 회원 탈퇴 훅
 */
export const useDeleteUser = () => {
    const { authApi, removeTokens } = useAuth();

    return useMutation({
        mutationFn: async () => {
            // 토큰이 필요하므로 authApi 사용
            const res = await authApi.delete('/user/delete');
            return res.data;
        },
        onSuccess: () => {
            removeTokens();
        },
    });
};
