import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Board {
  idx: number;
  title: string;
  content: string;
  writer: string;
  fileUrl: string | null;
  created: string;
}

const BoardDetailPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await apiClient.get<Board>(`/api/boards/${boardId}`);
        setBoard(response.data);
      } catch (error) {
        alert('존재하지 않는 게시글입니다.');
        navigate('/boards');
      }
    };
    fetchBoard();
  }, [boardId, navigate]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await apiClient.delete(`/api/boards/${boardId}`);
        alert('게시글이 삭제되었습니다.');
        navigate('/boards');
      } catch (error) {
        alert('게시글 삭제에 실패했습니다. 권한을 확인해주세요.');
      }
    }
  };

  if (!board) return <div>로딩 중...</div>;

  const createMarkup = (htmlContent: string) => ({ __html: htmlContent });

  return (
    <div className="detail-container">
      <h1>{board.title}</h1>
      <div className="info">
        <span>작성자: {board.writer}</span>
        <span>작성일: {new Date(board.created).toLocaleString()}</span>
      </div>
      <hr />
      {board.fileUrl && (
        <div className="file-attachment">
          <a href={board.fileUrl} target="_blank" rel="noopener noreferrer">
            첨부파일 다운로드
          </a>
        </div>
      )}
      <div className="content" dangerouslySetInnerHTML={createMarkup(board.content)} />

      <div className="button-group">
        <button onClick={() => navigate('/boards')}>목록으로</button>
        {(user?.id === board.writer || user?.userType === 'ADMIN') && (
          <>
            <button onClick={() => navigate(`/edit/${board.idx}`)}>수정</button>
            <button onClick={handleDelete} className="danger">
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BoardDetailPage;
