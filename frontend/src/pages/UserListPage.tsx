import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

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
      const response = await apiClient.get<UserListResponse>('/api/admin/users');
      setData(response.data);
    } catch (error) {
      alert('회원 목록을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (idToDelete: string, name: string) => {
    if (window.confirm(`${name}(${idToDelete})님을 정말로 삭제하시겠습니까?`)) {
      try {
        await apiClient.delete(`/api/admin/users/${idToDelete}`);
        alert(`사용자(${idToDelete})가 성공적으로 삭제되었습니다.`);
        fetchUsers();
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (!data) return <div>로딩 중...</div>;

  return (
    <div className="container-wide">
      <h1>전체 회원 목록</h1>
      <div className="info-summary">
        <span>
          총 회원: <strong>{data.totalCount}</strong>
        </span>
        <span style={{ marginLeft: '15px' }}>
          금일 가입: <strong>{data.todayCount}</strong>
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
              <td>
                {user.phone === null
                  ? null
                  : user.phone.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}
              </td>
              <td>{user.userType}</td>
              <td>{user.created.substring(0, 10)}</td>
              <td>
                {user.userType !== 'admin' && (
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
