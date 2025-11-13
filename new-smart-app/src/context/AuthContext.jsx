import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Refresh Token을 위한 Axios 인스턴스 (API 호출 시 사용)
// Access Token을 자동으로 헤더에 넣어주고, 401 에러 발생 시 토큰 갱신을 시도합니다.
const authApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  // 상태: 로그인 여부, 사용자 ID/이름, 로딩 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지에서 토큰 가져오기
  const getTokens = useCallback(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return { accessToken, refreshToken };
  }, []);

  // 토큰 저장
  const setTokens = useCallback((accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    // (추가) access_token을 세션 쿠키로 저장
    // Nginx auth_request가 이 쿠키를 읽어서 app.py로 전달합니다.
    document.cookie = `access_token_cookie=${accessToken}; path=/`;

    setIsAuthenticated(true);
  }, []);

  // 토큰 삭제 (로그아웃 및 토큰 무효화)
  const removeTokens = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // (추가) 쿠키 삭제 (만료일을 과거로 설정)
    document.cookie = 'access_token_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    setIsAuthenticated(false);
    setUser(null);
  }, []);

  // 3. 프로필 정보 가져오기 (인증 성공 후 사용자 정보를 가져오는 함수)
  const { mutate: fetchUserProfile } = useMutation({
    mutationFn: async () => {
      // Access Token을 포함하여 프로필 API 호출
      const { data } = await authApi.get('/user/profile');
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsAuthenticated(true);
    },
    onError: () => {
      // 토큰은 있지만 프로필 정보를 가져오지 못하면 로그아웃 처리
      removeTokens(); 
    },
    onSettled: () => {
        setIsLoading(false);
    }
  });


  // 4. 토큰 갱신 로직 (401 에러 발생 시)
  const { mutate: refreshAccessToken } = useMutation({
    mutationFn: async (refreshToken) => {
        const res = await axios.post('/api/auth/refresh', { refresh_token: refreshToken });
        return res.data;
    },
    onSuccess: (data) => {
        // 새 토큰 저장
        setTokens(data.access_token, data.refresh_token);
        // 토큰 갱신 성공 후 프로필 다시 가져오기
        fetchUserProfile();
    },
    onError: () => {
        // Refresh Token도 만료되었거나 유효하지 않음 -> 강제 로그아웃
        removeTokens();
    },
  });

  // 5. Axios Interceptor 설정 (가장 중요)
  useEffect(() => {
    const requestInterceptor = authApi.interceptors.request.use(
      config => {
        const { accessToken } = getTokens();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = authApi.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;
        // 401 에러 (토큰 만료) 이고, 아직 갱신 시도를 하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const { refreshToken } = getTokens();

          if (refreshToken) {
            // 토큰 갱신 시도
            await refreshAccessToken(refreshToken);
            
            // 새 Access Token으로 헤더 업데이트 후 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
            return authApi(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // 컴포넌트 언마운트 시 인터셉터 제거
      authApi.interceptors.request.eject(requestInterceptor);
      authApi.interceptors.response.eject(responseInterceptor);
    };
  }, [getTokens, refreshAccessToken]);


  // 6. 초기 로드 시 토큰 확인 및 프로필 가져오기
  useEffect(() => {
    const { accessToken } = getTokens();
    if (accessToken) {
        // 토큰이 있다면 프로필 정보로 유효성 검사 및 사용자 정보 로드
        fetchUserProfile();
    } else {
        setIsLoading(false); // 토큰이 없으면 로딩 완료
    }
  }, [getTokens, fetchUserProfile]);


  // 7. Context Value 제공
  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    authApi, // 인증된 API 호출에 사용할 Axios 인스턴스
    setTokens,
    removeTokens,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 8. Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

