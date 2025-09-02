
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ChangePassword from './Changepassword';
import '../styles/Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // profile dropdown
  const [servicesOpen, setServicesOpen] = useState(false); // services dropdown

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setServicesOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await API.post('/auth/logout', { refreshToken });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      alert('Logout failed');
    }
  };

  const goTo = (path: string) => {
    setServicesOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="header">
        <div className="logo">Timesheet</div>
        <nav className="nav">
          <a href="/dashboard">Home</a>
          <a href="/about">About</a>

          {/* Services with dropdown */}
          <div className="services-container" ref={servicesRef}>
            <button
              className="nav-link services-btn"
              aria-haspopup="true"
              aria-label="Open services menu"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen(v => !v)}
            >
              Services
              <span className={`caret ${servicesOpen ? 'open' : ''}`} />
            </button>

            {servicesOpen && (
              <div className="dropdown-menu" role="menu">
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => goTo('/timesheet')}
                >
                  Fill Timesheet 
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => goTo('/checkin')}
                >
                  CheckIn Time
                </button>
              </div>
            )}
          </div>

          <div className="profile-container" ref={dropdownRef}>
            <button
              className="profile profile-btn"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(v => !v)}
            >
              {userEmail ?? 'Guest'}
              <span className={`caret ${dropdownOpen ? 'open' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu" role="menu">
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowChangePassword(true);
                  }}
                >
                  Change Password
                </button>

                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default Header;
