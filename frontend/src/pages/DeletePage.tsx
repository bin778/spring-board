import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

function DeletePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까?')) {
      try {
        await apiClient.delete(`/api/users/delete`);
        alert('계정이 삭제되었습니다.');
        logout();
        navigate('/');
      } catch (error) {
        alert('계정 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div>
      <h2>{user?.name}님, 정말로 계정을 삭제하시겠습니까?</h2>
      <p>삭제된 계정은 복구할 수 없습니다.</p>
      <button type="button" onClick={() => navigate('/info')}>
        취소
      </button>
      <button type="button" onClick={handleDelete} style={{ backgroundColor: '#dc3545' }}>
        삭제
      </button>
    </div>
  );
}

export default DeletePage;
