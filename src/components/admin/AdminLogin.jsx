import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';

const AdminLogin = ({ email, setEmail, password, setPassword, handleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Lock size={40} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            لوحة التحكم
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            الرجاء إدخال معلومات الدخول
          </p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              style={{
                width: '100%',
                padding: '1rem',
                paddingRight: '3rem',
                border: '2px solid var(--border)',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              required
            />
            <div style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }}>
              <Mail size={20} />
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              style={{
                width: '100%',
                padding: '1rem',
                paddingRight: '3rem',
                border: '2px solid var(--border)',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}
          >
            <Lock size={20} style={{ marginLeft: '0.5rem' }} />
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
