import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import TiptapEditor from '../components/TiptapEditor';

interface BoardData {
  title: string;
  content: string;
  fileUrl: string | null;
  originalFileName: string | null;
}

interface FileInfo {
  fileUrl: string;
  originalFileName: string;
}

const BoardUpdatePage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardData | null>(null);
  const [newFileInfo, setNewFileInfo] = useState<FileInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await apiClient.get<BoardData>(`/api/boards/${boardId}`);
        setBoard(response.data);
      } catch (error) {
        alert('게시글 정보를 불러오는 데 실패했습니다.');
        navigate('/boards');
      }
    };
    fetchBoard();
  }, [boardId, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setNewFileInfo(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post<FileInfo>('/api/files/upload', formData);
      setNewFileInfo(response.data);
      setBoard(currentBoard => (currentBoard ? { ...currentBoard, fileUrl: null, originalFileName: null } : null));
    } catch (error) {
      alert('파일 업로드에 실패했습니다.');
    }
  };

  const handleRemoveExistingFile = () => {
    if (window.confirm('기존 첨부파일을 삭제하시겠습니까?')) {
      setBoard(currentBoard => (currentBoard ? { ...currentBoard, fileUrl: null, originalFileName: null } : null));
    }
  };

  const handleClearNewFile = () => {
    setNewFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!board) return;

    try {
      await apiClient.put(`/api/boards/${boardId}`, {
        title: board.title,
        content: board.content,
        fileUrl: newFileInfo?.fileUrl || board.fileUrl,
        originalFileName: newFileInfo?.originalFileName || board.originalFileName,
      });
      alert('게시글이 수정되었습니다.');
      navigate(`/boards/${boardId}`);
    } catch (error) {
      alert('게시글 수정에 실패했습니다. 권한을 확인해주세요.');
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
          {board.originalFileName ? (
            <div>
              <span>{board.originalFileName}</span>
              <button type="button" onClick={handleRemoveExistingFile} className="btn-cancel-file">
                삭제
              </button>
            </div>
          ) : (
            '없음'
          )}
        </div>
        <div className="form-group">
          <label htmlFor="file">새 파일 첨부</label>
          <input type="file" id="file" ref={fileInputRef} onChange={handleFileChange} />
          {newFileInfo && (
            <div>
              <span>{newFileInfo.originalFileName}</span>
              <button type="button" onClick={handleClearNewFile} className="btn-cancel-file">
                선택 취소
              </button>
            </div>
          )}
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
