import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  idx: number;
  content: string;
  writer: string;
  createdDate: string;
}

interface CommentsProps {
  boardId: string;
}

const Comments: React.FC<CommentsProps> = ({ boardId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(null);

  const fetchComments = async () => {
    const response = await apiClient.get<Comment[]>(`/api/boards/${boardId}/comments`);
    setComments(response.data);
  };

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await apiClient.post(`/api/boards/${boardId}/comments`, { content: newComment });
    setNewComment('');
    fetchComments();
  };

  const handleUpdate = async (id: number) => {
    if (!editingComment || !editingComment.content.trim()) return;
    await apiClient.put(`/api/comments/${id}`, { content: editingComment.content });
    setEditingComment(null);
    fetchComments();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      await apiClient.delete(`/api/comments/${id}`);
      fetchComments();
    }
  };

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
          />
          <button type="submit">등록</button>
        </form>
      )}
      <ul className="comment-list">
        {comments.map(comment => (
          <li key={comment.idx} className="comment-item">
            {editingComment?.id === comment.idx ? (
              <div className="comment-edit">
                <textarea
                  value={editingComment.content}
                  onChange={e => setEditingComment({ ...editingComment, content: e.target.value })}
                />
                <button onClick={() => handleUpdate(comment.idx)}>저장</button>
                <button onClick={() => setEditingComment(null)}>취소</button>
              </div>
            ) : (
              <div>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-meta">
                  <span>{comment.writer}</span>
                  <span>{new Date(comment.createdDate).toLocaleString()}</span>
                  {(user?.id === comment.writer || user?.userType === 'admin') && (
                    <div className="comment-actions">
                      <button onClick={() => setEditingComment({ id: comment.idx, content: comment.content })}>
                        수정
                      </button>
                      <button onClick={() => handleDelete(comment.idx)}>삭제</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
