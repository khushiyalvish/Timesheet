
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import '../styles/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await API.post('/auth/register', form);
      toast.success('🎉 Registration successful!');
      setTimeout(() => navigate('/'), 1500); 
    } catch (error) {
      toast.error('❌ Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" onChange={handleChange} type="password" placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
       <p className="link-text">
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default Register;
