import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

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

const RegisterPage = () => {
  const [formData, setFormData] = useState({ id: '', pwd: '', pwd2: '', name: '', phone: '', address: '' });
  const [validity, setValidity] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
  });
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setValidity(validatePassword(formData.pwd));
  }, [formData.pwd]);

  useEffect(() => {
    setIsPhoneValid(validatePhone(formData.phone));
  }, [formData.phone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isAllValid = Object.values(validity).every(Boolean);
    if (!isAllValid) {
      alert('비밀번호가 모든 조건을 만족하는지 확인해주세요.');
      return;
    }

    if (formData.pwd !== formData.pwd2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isPhoneValid) {
      alert('전화번호 형식이 올바르지 않습니다.');
      return;
    }

    try {
      await apiClient.post('/api/users/register', { ...formData });
      alert('회원가입이 완료되었습니다.');
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      } else if (error.response && error.response.status === 409) {
        alert('이미 존재하는 아이디입니다.');
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <h1>회원 가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="id" placeholder="아이디 입력" onChange={handleChange} required />
          <input type="password" name="pwd" placeholder="비밀번호 입력" onChange={handleChange} required />
          <div className="password-validation">
            <p className={validity.hasMinLength ? 'valid' : 'invalid'}>✓ 8자리 이상</p>
            <p className={validity.hasLowerCase ? 'valid' : 'invalid'}>✓ 소문자 포함</p>
            <p className={validity.hasUpperCase ? 'valid' : 'invalid'}>✓ 대문자 포함</p>
            <p className={validity.hasSpecialChar ? 'valid' : 'invalid'}>✓ 특수문자 포함</p>
          </div>

          <input type="password" name="pwd2" placeholder="비밀번호 확인" onChange={handleChange} required />
          <input type="text" name="name" placeholder="이름 입력" onChange={handleChange} required />

          <input type="text" name="phone" placeholder="전화번호 입력" onChange={handleChange} required />
          <div>
            {!isPhoneValid && formData.phone && <p className="error-message">전화번호 형식이 올바르지 않습니다.</p>}
          </div>

          <input type="text" name="address" placeholder="주소 입력" onChange={handleChange} required />
        </div>
        <div>
          <input type="submit" value="가입" />
        </div>
      </form>
      <div>
        <Link to="/" className="button">
          취소
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
