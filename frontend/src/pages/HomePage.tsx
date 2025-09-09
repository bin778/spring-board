import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

function HomePage() {
  const { user, login, logout } = useAuth();
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append('id', id);
    params.append('pwd', pwd);

    try {
      await apiClient.post('/api/users/login', params);

      const response = await apiClient.get('/api/users/me');
      alert(`${response.data.name}님, 환영합니다.`);
      login(response.data);

      navigate('/');
    } catch (error) {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = async () => {
    logout();
    alert('로그아웃 되었습니다.');
  };

  if (user) {
    return (
      <div>
        <p>
          <strong>{user.name}</strong>님, 환영합니다.
        </p>
        <button onClick={() => navigate('/info')}>내 정보</button>
        <button onClick={() => navigate('/write')}>글 작성</button>
        {user.userType === 'admin' && <button onClick={() => navigate('/admin/list')}>회원 목록</button>}
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    );
  }

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input type="text" value={id} onChange={e => setId(e.target.value)} placeholder="아이디 입력" required />
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="비밀번호 입력"
            required
          />
        </div>
        <div>
          <button type="submit">로그인</button>
          <a
            href="/register"
            onClick={e => {
              e.preventDefault();
              navigate('/register');
            }}
          >
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
}

export default HomePage;
