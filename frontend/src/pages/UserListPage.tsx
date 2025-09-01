import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import '../styles/list.css';

interface UserInfo {
  idx: number;
  id: string;
  name: string;
  phone: string;
  address: string;
  userType: string;
  created: string;
}

interface UserListResponse {
  userList: UserInfo[];
  totalCount: number;
  todayCount: number;
}

const UserListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<UserListResponse | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get<UserListResponse>('/users/list');
      setData(response.data);
    } catch (error) {
      console.error(error);
      alert('회원 목록을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (idToDelete: string, name: string) => {
    if (window.confirm(`${name}(${idToDelete})님을 정말로 삭제하시겠습니까?`)) {
      if (idToDelete === 'admin') {
        alert('관리자 계정은 삭제할 수 없습니다.');
        return;
      }
      try {
        await apiClient.delete(`/users/delete/${idToDelete}`);
        alert(`사용자(${idToDelete})가 성공적으로 삭제되었습니다.`);
        fetchUsers(); // 목록 새로고침
      } catch (error) {
        console.error(error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (!data) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>전체 회원 목록</h1>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <span>
          총 회원 수: <strong>{data.totalCount}</strong>명
        </span>
        <span style={{ marginLeft: '15px' }}>
          금일 가입자: <strong>{data.todayCount}</strong>명
        </span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>번호</th>
            <th>아이디</th>
            <th>이름</th>
            <th>연락처</th>
            <th>타입</th>
            <th>가입일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {data.userList.map(user => (
            <tr key={user.idx}>
              <td>{user.idx}</td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.userType}</td>
              <td>{user.created.substring(0, 10)}</td>
              <td>
                {user.id !== 'admin' && (
                  <>
                    <button onClick={() => navigate(`/admin/update/${user.id}`)}>수정</button>
                    <button onClick={() => handleDelete(user.id, user.name)} style={{ backgroundColor: '#dc3545' }}>
                      삭제
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
        메인으로
      </button>
    </div>
  );
};

export default UserListPage;
