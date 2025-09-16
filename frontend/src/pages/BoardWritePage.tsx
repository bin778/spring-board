import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import TiptapEditor from '../components/TiptapEditor';

interface FileInfo {
  fileUrl: string;
  originalFileName: string;
}

function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<FileInfo | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post<FileInfo>('/api/files/upload', formData);
      setAttachedFile(response.data);
    } catch (error) {
      alert('파일 업로드에 실패했습니다.');
    }
  };

  const handleClearFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/boards/write', {
        title,
        content,
        fileUrl: attachedFile?.fileUrl,
        originalFileName: attachedFile?.originalFileName,
      });
      alert('게시글이 작성되었습니다.');
      navigate('/boards');
    } catch (error) {
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div>
      <h1>게시글 작성</h1>
      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            ref={fileInputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
          {attachedFile && (
            <button type="button" onClick={handleClearFile} className="btn-cancel-file">
              선택 취소
            </button>
          )}
        </div>
        <div className="form-group">
          <label>내용</label>
          <TiptapEditor onContentChange={setContent} />
        </div>
        <div className="form-group">
          <label htmlFor="file">파일 첨부</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div className="button-group">
          <button type="submit">작성 완료</button>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default WritePage;
