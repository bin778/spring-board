import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const HomePage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/users/login', { id, pwd });
      login(response.data);
      alert(`${response.data.name}님, 환영합니다.`);
    } catch (error) {
      console.error(error);
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = async () => {
    await logout();
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
        {user.userType === 'admin' && <button onClick={() => navigate('/list')}>회원 목록</button>}
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
          <input type="submit" value="로그인" />
          <Link to="/register">회원가입</Link>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
