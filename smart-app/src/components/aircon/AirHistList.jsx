import React, { useState, useEffect } from 'react';

// 명령어 코드에 대한 설명을 정의한 배열
const commandDescriptions = [
    '전원 OFF',
    '전원 ON 및 냉방. 약풍, 18도',
    '파워냉방',
    '냉방. 약풍, 18도',
    '냉방. 약풍, 19도',
    '냉방. 약풍, 20도',
    '냉방. 약풍, 21도',
    '냉방. 약풍, 22도',
    '냉방. 약풍, 23도',
    '냉방. 약풍, 24도',
    '냉방. 약풍, 25도',
    '냉방. 약풍, 26도',
    '냉방. 약풍, 27도',
    '냉방. 약풍, 28도',
    '냉방. 약풍, 29도',
    '냉방. 약풍, 30도',
    '냉방. 중풍, 18도',
    '냉방. 중풍, 19도',
    '냉방. 중풍, 20도',
    '냉방. 중풍, 21도',
    '냉방. 중풍, 22도',
    '냉방. 중풍, 23도',
    '냉방. 중풍, 24도',
    '냉방. 중풍, 25도',
    '냉방. 중풍, 26도',
    '냉방. 중풍, 27도',
    '냉방. 중풍, 28도',
    '냉방. 중풍, 29도',
    '냉방. 중풍, 30도',
    '냉방. 강풍, 18도',
    '냉방. 강풍, 19도',
    '냉방. 강풍, 20도',
    '냉방. 강풍, 21도',
    '냉방. 강풍, 22도',
    '냉방. 강풍, 23도',
    '냉방. 강풍, 24도',
    '냉방. 강풍, 25도',
    '냉방. 강풍, 26도',
    '냉방. 강풍, 27도',
    '냉방. 강풍, 28도',
    '냉방. 강풍, 29도',
    '냉방. 강풍, 30도',
    '냉방. 자동풍, 18도',
    '냉방. 자동풍, 19도',
    '냉방. 자동풍, 20도',
    '냉방. 자동풍, 21도',
    '냉방. 자동풍, 22도',
    '냉방. 자동풍, 23도',
    '냉방. 자동풍, 24도',
    '냉방. 자동풍, 25도',
    '냉방. 자동풍, 26도',
    '냉방. 자동풍, 27도',
    '냉방. 자동풍, 28도',
    '냉방. 자동풍, 29도',
    '냉방. 자동풍, 30도',
    '제습. 약풍, 18도',
    '제습. 약풍, 19도',
    '제습. 약풍, 20도',
    '제습. 약풍, 21도',
    '제습. 약풍, 22도',
    '제습. 약풍, 23도',
    '제습. 약풍, 24도',
    '제습. 약풍, 25도',
    '제습. 약풍, 26도',
    '제습. 약풍, 27도',
    '제습. 약풍, 28도',
    '제습. 약풍, 29도',
    '제습. 약풍, 30도',
    '제습. 중풍, 18도',
    '제습. 중풍, 19도',
    '제습. 중풍, 20도',
    '제습. 중풍, 21도',
    '제습. 중풍, 22도',
    '제습. 중풍, 23도',
    '제습. 중풍, 24도',
    '제습. 중풍, 25도',
    '제습. 중풍, 26도',
    '제습. 중풍, 27도',
    '제습. 중풍, 28도',
    '제습. 중풍, 29도',
    '제습. 중풍, 30도',
    '제습. 강풍, 18도',
    '제습. 강풍, 19도',
    '제습. 강풍, 20도',
    '제습. 강풍, 21도',
    '제습. 강풍, 22도',
    '제습. 강풍, 23도',
    '제습. 강풍, 24도',
    '제습. 강풍, 25도',
    '제습. 강풍, 26도',
    '제습. 강풍, 27도',
    '제습. 강풍, 28도',
    '제습. 강풍, 29도',
    '제습. 강풍, 30도',
    '제습. 자동풍, 18도',
    '제습. 자동풍, 19도',
    '제습. 자동풍, 20도',
    '제습. 자동풍, 21도',
    '제습. 자동풍, 22도',
    '제습. 자동풍, 23도',
    '제습. 자동풍, 24도',
    '제습. 자동풍, 25도',
    '제습. 자동풍, 26도',
    '제습. 자동풍, 27도',
    '제습. 자동풍, 28도',
    '제습. 자동풍, 29도',
    '제습. 자동풍, 30도',
];

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

const AirHistList = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const pageRange = 2; // 현재 페이지를 기준으로 앞뒤로 보여줄 페이지 수

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/arduino/aircon-history?page=${currentPage}&limit=${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch air conditioning history.');
                }
                const result = await response.json();
                setHistory(result.data);
                setTotalPages(Math.ceil(result.total / itemsPerPage));
            } catch (err) {
                console.error('API Error:', err);
                setError('에어컨 제어 기록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) {
            return;
        }
        setCurrentPage(pageNumber);
    };

    const getCommandDescription = (command) => {
        const parts = command.split(' ');
        if (parts[0] === 'SEND' && parts.length > 1) {
            const index = parseInt(parts[1].split(',')[0]);
            if (!isNaN(index) && index >= 0 && index < commandDescriptions.length) {
                return commandDescriptions[index];
            }
        }
        return command; // 형식이 맞지 않으면 원래 명령어를 반환
    };

    const renderPagination = () => {
        const startPage = Math.max(1, currentPage - pageRange);
        const endPage = Math.min(totalPages, currentPage + pageRange);
        const pages = [];

        // 이전 페이지 버튼
        pages.push(
            <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a
                    className="page-link"
                    href="#"
                    aria-label="Previous"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                    }}
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        );

        // 첫 페이지 버튼 (선택적으로)
        if (startPage > 1) {
            pages.push(
                <li key={1} className="page-item">
                    <a
                        className="page-link"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                        }}
                    >
                        1
                    </a>
                </li>
            );
            if (startPage > 2) {
                pages.push(
                    <li key="ellipsis-start" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }
        }

        // 현재 페이지 주변의 페이지 버튼
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i);
                        }}
                    >
                        {i}
                    </a>
                </li>
            );
        }

        // 마지막 페이지 버튼 (선택적으로)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <li key="ellipsis-end" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }
            pages.push(
                <li key={totalPages} className="page-item">
                    <a
                        className="page-link"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                        }}
                    >
                        {totalPages}
                    </a>
                </li>
            );
        }

        // 다음 페이지 버튼
        pages.push(
            <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a
                    className="page-link"
                    href="#"
                    aria-label="Next"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                    }}
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        );

        return (
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-4">{pages}</ul>
            </nav>
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-danger text-center fw-bold">{error}</p>;
    }

    return (
        <div className="container card shadow-sm p-4 rounded-4 mb-4">
            {history.length > 0 ? (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover rounded-3 overflow-hidden">
                            <thead className="table-primary">
                                <tr className="text-center">
                                    <th scope="col">#</th>
                                    <th scope="col">명령어</th>
                                    <th scope="col">응답</th>
                                    <th scope="col">시간</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr className="text-center" key={item.id}>
                                        <th scope="row">{item.id}</th>
                                        <td>{getCommandDescription(item.command)}</td>
                                        <td>{item.response}</td>
                                        <td>{formatDate(item.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {renderPagination()}
                </>
            ) : (
                <p className="text-center text-muted">기록이 없습니다.</p>
            )}
        </div>
    );
};

export default AirHistList;
