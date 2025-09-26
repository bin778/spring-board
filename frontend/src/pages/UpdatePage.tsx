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

const validatePassword = (password: string) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return { hasMinLength, hasUpperCase, hasLowerCase, hasSpecialChar };
};

const validatePhone = (phone: string) => {
  if (!phone) return true;
  const phoneRegex = /^\d{9,11}$/;
  return phoneRegex.test(phone.replaceAll('-', ''));
};

const UpdatePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isAdminUpdate = !!userId;

  const [formData, setFormData] = useState<UserData>({ id: '', name: '', phone: '', address: '' });
  const [validity, setValidity] = useState({
    hasMinLength: true,
    hasUpperCase: true,
    hasLowerCase: true,
    hasSpecialChar: true,
  });
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  useEffect(() => {
    if (formData.pwd) {
      setValidity(validatePassword(formData.pwd));
    } else {
      setValidity({ hasMinLength: true, hasUpperCase: true, hasLowerCase: true, hasSpecialChar: true });
    }
  }, [formData.pwd]);

  useEffect(() => {
    setIsPhoneValid(validatePhone(formData.phone));
  }, [formData.phone]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = isAdminUpdate
          ? await apiClient.get<UserData>(`/api/admin/users/${userId}`)
          : await apiClient.get<UserData>('/api/users/me');
        setFormData({ ...response.data, pwd: '' });
      } catch (error) {
        alert('사용자 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchUserData();
  }, [userId, isAdminUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pwd && !Object.values(validity).every(Boolean)) {
      alert('새 비밀번호가 모든 조건을 만족하는지 확인해주세요.');
      return;
    }

    if (!isPhoneValid) {
      alert('전화번호 형식이 올바르지 않습니다.');
      return;
    }

    try {
      const updateUrl = isAdminUpdate ? `/api/admin/users/update` : `/api/users/update`;
      await apiClient.put(updateUrl, formData);

      if (isAdminUpdate) {
        alert(`${formData.name}님의 정보가 수정되었습니다.`);
        navigate('/admin/list');
      } else {
        alert('정보가 수정되었습니다. 다시 로그인해주세요.');
        await apiClient.post('/api/users/logout');
        logout();
        navigate('/');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      } else {
        alert('정보 수정에 실패했습니다.');
      }
    }
  };

  return (
    <div className="container">
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
        {formData.pwd && (
          <div className="password-validation">
            <p className={validity.hasMinLength ? 'valid' : 'invalid'}>✓ 8자리 이상</p>
            <p className={validity.hasLowerCase ? 'valid' : 'invalid'}>✓ 소문자 포함</p>
            <p className={validity.hasUpperCase ? 'valid' : 'invalid'}>✓ 대문자 포함</p>
            <p className={validity.hasSpecialChar ? 'valid' : 'invalid'}>✓ 특수문자 포함</p>
          </div>
        )}
        <input type="text" name="name" required value={formData.name} onChange={handleChange} />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        {!isPhoneValid && formData.phone && <p className="error-message">전화번호 형식이 올바르지 않습니다.</p>}
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        <button type="button" onClick={() => navigate(isAdminUpdate ? '/admin/list' : '/info')}>
          취소
        </button>
        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default UpdatePage;
