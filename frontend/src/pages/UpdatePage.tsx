import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

interface UserData {
  id: string;
  pwd?: string;
  name: string;
  phone: string;
  address: string;
}

function UpdatePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isAdminUpdate = !!userId;

  const [formData, setFormData] = useState<UserData>({ id: '', name: '', phone: '', address: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let response;
        if (isAdminUpdate) {
          response = await apiClient.get(`/api/admin/users/${userId}`);
        } else {
          response = await apiClient.get('/api/users/me');
        }
        setFormData({ ...response.data, pwd: '' });
      } catch (error) {
        alert('사용자 정보를 불러오는 데 실패했습니다.');
        navigate(isAdminUpdate ? '/admin/list' : '/');
      }
    };
    fetchUserData();
  }, [userId, isAdminUpdate, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateUrl = isAdminUpdate ? `/api/admin/users/update` : `/api/users/update`;

      const payload = { ...formData };
      if (!payload.pwd) {
        delete payload.pwd;
      }

      await apiClient.put(updateUrl, payload);

      if (isAdminUpdate) {
        alert(`${formData.name}님의 정보가 성공적으로 수정되었습니다.`);
        navigate('/admin/list');
      } else {
        alert('정보가 수정되었습니다. 다시 로그인해주세요.');
        await apiClient.post('/api/users/logout');
        logout();
        navigate('/');
      }
    } catch (error) {
      alert('정보 수정에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>'{formData.name}'님의 정보를 수정합니다.</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={formData.id} />
        <input
          type="password"
          name="pwd"
          placeholder="새 비밀번호 (변경 시에만 입력)"
          value={formData.pwd || ''}
          onChange={handleChange}
        />
        <input type="text" name="name" required value={formData.name} onChange={handleChange} />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        <button type="button" onClick={() => navigate(isAdminUpdate ? '/admin/list' : '/info')}>
          취소
        </button>
        <button type="submit">수정</button>
      </form>
    </div>
  );
}

export default UpdatePage;
