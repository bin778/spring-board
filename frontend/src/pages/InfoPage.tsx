import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/info.css';

const InfoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div>
      <h1>내 정보</h1>
      <h2>
        <strong>{user.name}</strong>님의 회원 정보입니다.
      </h2>
      <div className="info-container">
        <div className="info-item">
          <div style={{ textAlign: 'left', margin: '30px 0' }}>
            <p>
              <strong>아이디:</strong> {user.id}
            </p>
            <p>
              <strong>이름:</strong> {user.name}
            </p>
            <p>
              <strong>연락처:</strong> {user.phone}
            </p>
            <p>
              <strong>주소:</strong> {user.address}
            </p>
          </div>
        </div>
      </div>
      <div>
        <button onClick={() => navigate('/update')}>정보 수정</button>
        <button onClick={() => navigate('/delete')}>회원 탈퇴</button>
        <button onClick={() => navigate('/')}>메인으로</button>
      </div>
    </div>
  );
};

export default InfoPage;
