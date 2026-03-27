import React, { useState } from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div style={{
      width: '100%', height: '100dvh', background: 'var(--primary-gradient)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: 'var(--space-24)', position: 'relative', overflow: 'hidden'
    }} className="animate-fade-in">
      
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(46,216,163,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>

      <div style={{ width: '100%', maxWidth: '400px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
          <div style={{ width: 64, height: 64, background: 'var(--card-bg)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-16)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '10px' }}></div>
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>Chào mừng trở lại</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>Đăng nhập để quản lý tài chính</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-24)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleLogin} className="flex-column" style={{ gap: 'var(--space-16)' }}>
            <div>
              <label className="input-label" style={{ fontSize: '13px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="name@example.com"
                  style={{ paddingLeft: '48px', background: 'var(--bg-color)', borderRadius: '16px' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '13px' }}>Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  style={{ paddingLeft: '48px', background: 'var(--bg-color)', borderRadius: '16px' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="button-primary" style={{ marginTop: 'var(--space-8)', borderRadius: '16px', padding: '16px', fontSize: '16px' }}>
              Đăng nhập
            </button>
            
            <button type="button" className="button-primary" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginTop: 0, borderRadius: '16px', padding: '16px', fontSize: '16px', boxShadow: 'none' }}>
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
