import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import TiptapEditor from '../components/TiptapEditor';

interface BoardData {
  title: string;
  content: string;
  fileUrl?: string | null;
}

const BoardUpdatePage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardData | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await apiClient.get<BoardData>(`/api/boards/${boardId}`);
        setBoard(response.data);
      } catch (error) {
        alert('게시글 정보를 불러오는데 실패했습니다.');
        navigate('/boards');
      }
    };
    fetchBoard();
  }, [boardId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!board) return;

    let fileUrl = board.fileUrl;
    if (newFile) {
      const formData = new FormData();
      formData.append('file', newFile);
      try {
        const res = await apiClient.post('/api/files/upload', formData);
        fileUrl = res.data;
      } catch {
        alert('파일 업로드 실패');
        return;
      }
    }

    try {
      await apiClient.put(`/api/boards/${boardId}`, { ...board, fileUrl });
      alert('게시글이 수정되었습니다.');
      navigate(`/boards/${boardId}`);
    } catch {
      alert('게시글 수정 실패. 권한을 확인해주세요.');
    }
  };

  if (!board) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>게시글 수정</h1>
      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={board.title}
            onChange={e => setBoard({ ...board, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <TiptapEditor
            initialContent={board.content}
            onContentChange={html => setBoard(b => (b ? { ...b, content: html } : null))}
          />
        </div>
        <div className="form-group">
          <label>현재 첨부파일</label>
          {board.fileUrl ? (
            <a href={board.fileUrl} target="_blank" rel="noreferrer">
              {board.fileUrl.split('/').pop()}
            </a>
          ) : (
            '없음'
          )}
        </div>
        <div className="form-group">
          <label htmlFor="file">새 파일 첨부</label>
          <input type="file" id="file" onChange={e => e.target.files && setNewFile(e.target.files[0])} />
        </div>
        <div className="button-group">
          <button type="submit">수정 완료</button>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardUpdatePage;
