import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Python 백엔드 서버(app.py)가 5000번 포트에서 실행 중이라고 가정합니다.
        // /api로 시작하는 모든 요청을 5000번 포트로 전달합니다.
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
