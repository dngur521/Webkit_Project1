import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AirControlPage from './pages/AirControlPage';
import AirHistoryPage from './pages/AirHistoryPage';
import TempCheckPage from './pages/TempCheckPage';
import TempHistoryPage from './pages/TempHistoryPage';

/**
 * App 컴포넌트는 메인 레이아웃과 라우팅을 관리합니다.
 */
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aircon/control" element={<AirControlPage />} />
        <Route path="/aircon/history" element={<AirHistoryPage />} />
        <Route path="/temp/check" element={<TempCheckPage />} />
        <Route path="/temp/history" element={<TempHistoryPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
