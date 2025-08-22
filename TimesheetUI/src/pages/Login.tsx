import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userEmail', data.email);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login Failed !');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        name="email"
        onChange={handleChange}
        placeholder="Email"
        type="email"
        value={form.email}
      />
      <input
        name="password"
        onChange={handleChange}
        type="password"
        placeholder="Password"
        value={form.password}
      />
      <button onClick={handleLogin}>Login</button>
      <p className="link-text">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
