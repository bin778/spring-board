import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../services/api';

const UpdatePage = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams(); // For admin update: /admin/update/:userId
  const isAdminUpdate = !!userId;

  const [formData, setFormData] = useState({
    id: '',
    pwd: '',
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const idToFetch = isAdminUpdate ? userId : currentUser?.id;
        if (!idToFetch) return;
        const response = await apiClient.get(`/users/${idToFetch}`);
        setFormData({ ...response.data, pwd: '' }); // pwd는 비워둠
      } catch (error) {
        console.error(error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchUserData();
  }, [userId, currentUser, isAdminUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put(`/users/update`, formData);
      if (isAdminUpdate) {
        alert(`${formData.name}님의 정보가 수정되었습니다.`);
        navigate('/list');
      } else {
        alert('정보가 수정되었습니다. 다시 로그인해주세요.');
        await logout();
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('정보 수정에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>'{formData.name}'님의 회원 정보를 수정합니다.</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={formData.id} />
        <div>
          <input
            type="password"
            name="pwd"
            placeholder="새 비밀번호 (변경 시에만 입력)"
            value={formData.pwd}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="이름 입력"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="전화번호 입력"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="주소 입력"
            required
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={() => navigate(isAdminUpdate ? '/list' : '/info')}>
          취소
        </button>
        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default UpdatePage;
