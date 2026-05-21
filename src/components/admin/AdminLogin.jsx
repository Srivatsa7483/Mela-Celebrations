import React, { useState } from 'react';

const AdminLogin = ({ setCurrentPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate brief loading
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('mela_admin_auth', 'true');
        setCurrentPage('admin-dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2d45 50%, #0d1b2a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Jost', 'Inter', sans-serif",
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background circles */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-120px', left: '-80px',
        width: '350px', height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Back to site button */}
      <button
        onClick={() => setCurrentPage('home')}
        style={{
          position: 'absolute', top: '24px', left: '24px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.7)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
          letterSpacing: '0.04em'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        }}
      >
        ← Back to Site
      </button>

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: '20px',
        padding: '48px 40px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.1)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/logo.jpg"
            alt="Mela Celebrations"
            style={{
              width: '64px', height: '64px',
              borderRadius: '50%',
              border: '2px solid rgba(201,168,76,0.5)',
              objectFit: 'cover',
              marginBottom: '16px'
            }}
          />
          <div style={{
            display: 'inline-block',
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '0.7rem',
            color: '#c9a84c',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            Admin Portal
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '1.6rem',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.85rem',
            margin: '8px 0 0 0',
            letterSpacing: '0.03em'
          }}>
            Sign in to manage Mela Celebrations
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(230,57,70,0.15)',
            border: '1px solid rgba(230,57,70,0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#ff7c85',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Username */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(255,255,255,0.65)',
              fontSize: '0.78rem',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              style={{
                width: '100%',
                padding: '13px 16px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(201,168,76,0.6)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                e.target.style.background = 'rgba(255,255,255,0.07)';
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(255,255,255,0.65)',
              fontSize: '0.78rem',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  padding: '13px 48px 13px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(201,168,76,0.6)';
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.07)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', fontSize: '1rem', padding: 0,
                  lineHeight: 1
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '14px',
              background: loading
                ? 'rgba(201,168,76,0.4)'
                : 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 50%, #c9a84c 100%)',
              color: loading ? 'rgba(255,255,255,0.6)' : '#0d1b2a',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(201,168,76,0.35)',
            }}
            onMouseEnter={e => {
              if (!loading) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? '⏳ Signing In...' : '🔐 Sign In to Admin'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.75rem',
          marginTop: '28px',
          marginBottom: 0,
          letterSpacing: '0.03em'
        }}>
          🔒 Secure admin access only · Mela Celebrations
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
