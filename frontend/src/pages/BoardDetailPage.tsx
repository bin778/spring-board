import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Comments from '../components/Comments';
import { useAuth } from '../contexts/AuthContext';

interface Board {
  idx: number;
  title: string;
  content: string;
  writer: string;
  fileUrl: string | null;
  originalFileName: string | null;
  created: string;
  ipAddress: string;
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
        console.error('게시글을 불러오는데 실패했습니다.', error);
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

  if (!board) {
    return <div>로딩 중...</div>;
  }

  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <div className="detail-container">
      <h1>{board.title}</h1>
      <div className="info">
        <span>작성자: {board.writer}</span>
        <span>작성일: {new Date(board.created).toLocaleString()}</span>
        {user?.userType === 'admin' && <span className="ip-address">IP: {board.ipAddress}</span>}
      </div>
      <hr className="divider" />
      {board.fileUrl && board.originalFileName && (
        <div className="file-attachment">
          <a
            href={`http://localhost:8080/api/files/download/${board.fileUrl}?originalFileName=${encodeURIComponent(
              board.originalFileName,
            )}`}
          >
            {board.originalFileName}
          </a>
        </div>
      )}
      <div className="content" dangerouslySetInnerHTML={createMarkup(board.content)} />

      <div className="button-group">
        <button onClick={() => navigate('/boards')}>목록으로</button>
        {(user?.id === board.writer || user?.userType === 'admin') && (
          <>
            <button onClick={() => navigate(`/edit/${board.idx}`)}>수정</button>
            <button onClick={handleDelete} className="danger">
              삭제
            </button>
          </>
        )}
      </div>
      <Comments boardId={boardId!} />
    </div>
  );
};

export default BoardDetailPage;
