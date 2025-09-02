
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api/axios';
// import { toast } from 'react-toastify';
// import '../styles/register.css';

// const Register = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: '', email: '', password: '' });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async () => {
//     try {
//       const response = await API.post('/auth/register', form);
//       toast.success('🎉 Registration successful!');
//       setTimeout(() => navigate('/'), 1500); 
//     } catch (error) {
//       toast.error('❌ Registration failed. Please try again.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="register-container">
//       <h2>Register</h2>
//       <input name="name" onChange={handleChange} placeholder="Name" />
//       <input name="email" onChange={handleChange} placeholder="Email" />
//       <input name="password" onChange={handleChange} type="password" placeholder="Password" />
//       <button onClick={handleRegister}>Register</button>
//        <p className="link-text">
//         Already have an account? <a href="/">Login</a>
//       </p>
//     </div>
//   );
// };

// export default Register;





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import '../styles/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === 'email' && !value.trim()) {
      setErrors((prev) => ({ ...prev, email: 'Email is required.' }));
    } else if (name === 'password' && !value.trim()) {
      setErrors((prev) => ({ ...prev, password: 'Password is required.' }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async () => {
    // Check required fields before API call
    const newErrors: { email?: string; password?: string } = {};
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    if (!form.password.trim()) newErrors.password = 'Password is required.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in required fields.');
      return;
    }

    try {
      await API.post('/auth/register', form);
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

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name (optional)"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Email"
      />
      {touched.email && errors.email && <div className="error-text">{errors.email}</div>}

      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Password"
      />
      {touched.password && errors.password && <div className="error-text">{errors.password}</div>}

      <button onClick={handleRegister}>Register</button>

      <p className="link-text">
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default Register;




