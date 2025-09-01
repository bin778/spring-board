import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    pwd: '',
    pwd2: '',
    name: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pwd !== formData.pwd2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await apiClient.post('/users/register', {
        id: formData.id,
        pwd: formData.pwd,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('회원가입에 실패했습니다. 아이디가 중복될 수 있습니다.');
    }
  };

  return (
    <div>
      <h1>회원 가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="id" placeholder="아이디 입력" onChange={handleChange} required />
          <input type="password" name="pwd" placeholder="비밀번호 입력" onChange={handleChange} required />
          <input type="password" name="pwd2" placeholder="비밀번호 확인" onChange={handleChange} required />
          <input type="text" name="name" placeholder="이름 입력" onChange={handleChange} required />
          <input type="text" name="phone" placeholder="전화번호 입력" onChange={handleChange} required />
          <input type="text" name="address" placeholder="주소 입력" onChange={handleChange} required />
        </div>
        <div>
          <input type="submit" value="가입" />
        </div>
      </form>
      <div>
        <Link to="/">취소</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
