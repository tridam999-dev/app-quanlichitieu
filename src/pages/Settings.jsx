import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Moon, Sun, Globe, Database, HelpCircle, ChevronRight, LogOut, Clock } from 'lucide-react';
import RecurringTransactionsModal from '../components/RecurringTransactionsModal';

export default function Settings() {
  const { settings, updateSettings } = useFinance();
  const [showRecurring, setShowRecurring] = useState(false);

  const handleClearData = () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá tất cả dữ liệu không?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSyncData = () => {
    alert("Đã đồng bộ lên Cloud thành công!");
  };

  return (
    <div className="page animate-fade-in">
      <div className="header">
        <h1 className="title">Cài đặt</h1>
      </div>

      <div style={{ paddingBottom: 'var(--space-16)' }}>
        <div style={{ paddingLeft: 'var(--space-8)', marginBottom: 'var(--space-8)', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Tuyỳ chỉnh
        </div>
        
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-24)' }}>
          <div className="flex-between" style={{ padding: 'var(--space-16)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex-start">
              <div className="icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-section-title)' }}>Giao diện tối</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.theme === 'dark'}
                onChange={(e) => updateSettings({ theme: e.target.checked ? 'dark' : 'light' })}
                style={{ width: 44, height: 24, accentColor: 'var(--success)' }}
              />
            </label>
          </div>

          <div className="flex-between" style={{ padding: 'var(--space-16)' }}>
            <div className="flex-start">
              <div className="icon-wrapper" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                <Globe size={18} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-section-title)' }}>Tiền tệ</span>
            </div>
            <select 
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 500, textAlign: 'right', appearance: 'none' }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="VND">VND (₫)</option>
            </select>
          </div>
        </div>

        <div style={{ paddingLeft: 'var(--space-8)', marginBottom: 'var(--space-8)', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Tuỳ chọn nâng cao
        </div>
        
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-24)' }}>
          <div className="flex-between interactive" style={{ padding: 'var(--space-16)', cursor: 'pointer' }} onClick={() => setShowRecurring(true)}>
            <div className="flex-start">
              <div className="icon-wrapper" style={{ background: 'rgba(88, 86, 214, 0.1)', color: '#5856d6' }}>
                <Clock size={18} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-section-title)' }}>Chi tiêu định kỳ</span>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </div>
        </div>

        <div style={{ paddingLeft: 'var(--space-8)', marginBottom: 'var(--space-8)', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Dữ liệu & Tài khoản
        </div>
        
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-24)' }}>
          <div className="flex-between interactive" style={{ padding: 'var(--space-16)', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={handleSyncData}>
            <div className="flex-start">
              <div className="icon-wrapper" style={{ background: 'rgba(0,122,255,0.1)', color: '#007aff' }}>
                <Database size={18} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-section-title)' }}>Đồng bộ đám mây</span>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </div>

          <div className="flex-between interactive" style={{ padding: 'var(--space-16)', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
            <div className="flex-start">
              <div className="icon-wrapper" style={{ background: 'rgba(255,149,0,0.1)', color: '#ff9500' }}>
                <HelpCircle size={18} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-section-title)' }}>Trợ giúp & Hỗ trợ</span>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </div>

          <div className="flex-between interactive" style={{ padding: 'var(--space-16)', cursor: 'pointer' }} onClick={handleClearData}>
            <div className="flex-start">
              <div className="icon-wrapper" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                <LogOut size={18} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-section-title)', color: 'var(--danger)' }}>Xoá dữ liệu</span>
            </div>
          </div>
        </div>

        <p className="text-muted" style={{ textAlign: 'center', fontSize: '12px', marginTop: 'var(--space-32)' }}>
          Finance Flow App v1.0.0<br/>Mobile Banking Standard
        </p>
      </div>

      {showRecurring && <RecurringTransactionsModal onClose={() => setShowRecurring(false)} />}
    </div>
  );
}
