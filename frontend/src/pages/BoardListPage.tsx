import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../services/api';

interface Board {
  idx: number;
  title: string;
  writer: string;
  created: string;
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const BoardListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageData, setPageData] = useState<Page<Board> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page') || '0', 10);
  const currentSearch = queryParams.get('search') || '';

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await apiClient.get<Page<Board>>('/api/boards', {
          params: { page: currentPage, search: currentSearch },
        });
        setPageData(response.data);
      } catch (error) {
        console.error('게시글 목록 로딩 실패', error);
      }
    };
    fetchBoards();
  }, [currentPage, currentSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/boards?search=${searchTerm}&page=0`);
  };

  if (!pageData) return <div>로딩 중...</div>;

  return (
    <div className="list-container">
      <h1>게시판</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="제목 또는 내용으로 검색"
        />
        <button type="submit">검색</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {pageData.content.map(board => (
            <tr key={board.idx} onClick={() => navigate(`/boards/${board.idx}`)} style={{ cursor: 'pointer' }}>
              <td>{board.idx}</td>
              <td>{board.title}</td>
              <td>{board.writer}</td>
              <td>{new Date(board.created).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: pageData.totalPages }, (_, i) => i).map(pageNumber => (
          <button
            key={pageNumber}
            disabled={pageNumber === pageData.number}
            onClick={() => navigate(`/boards?page=${pageNumber}&search=${currentSearch}`)}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
};

export default BoardListPage;
