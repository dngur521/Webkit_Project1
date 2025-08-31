import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Side from './components/Side';
import Footer from './components/Footer';
import Home from './pages/Home';
import AirHistApp from './components/aircon/AirHistApp';
import AirControl from './components/aircon/AirControl';
import TempCheck from './components/temperature/TempCheck';
import TempHistApp from './components/temperature/TempHistApp';

function App() {
    return (
        <>
            <div className="container fluid py-5">
                <BrowserRouter>
                    <Row>
                        <Col className="mb-5">
                            <Header />
                        </Col>
                    </Row>
                    <Row className="main">
                        <Col xs={12} sm={4} md={4} lg={3} className="d-none d-sm-block mt-3">
                            <Side />
                        </Col>
                        <Col xs={12} sm={8} md={8} lg={9}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/aircon/control" element={<AirControl />} />
                                <Route path="/aircon/history" element={<AirHistApp />} />
                                <Route path="/temp/check" element={<TempCheck />} />
                                <Route path="/temp/history" element={<TempHistApp />} />
                            </Routes>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}></Col>
                    </Row>
                </BrowserRouter>
            </div>
            <Footer />
        </>
    );
}

export default App;
