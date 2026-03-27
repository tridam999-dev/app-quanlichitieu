import React from 'react';
import { Home, ReceiptText, Target, Settings, Plus } from 'lucide-react';
import TransactionModal from './TransactionModal';

export const Layout = ({ activeTab, onTabChange, children }) => {
  const [isAdding, setIsAdding] = React.useState(false);

  return (
    <div className="app-container">
      <div key={activeTab} className="page-transition-wrapper" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      <div className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
          style={{ color: activeTab === 'dashboard' ? 'var(--nav-color-dashboard)' : 'var(--text-subtle)' }}
        >
          <div className="nav-icon-container" style={{
            backgroundColor: activeTab === 'dashboard' ? 'var(--nav-bg-dashboard)' : 'transparent',
            color: activeTab === 'dashboard' ? 'var(--nav-color-dashboard)' : 'var(--text-subtle)',
            boxShadow: activeTab === 'dashboard' ? '0 4px 16px rgba(46, 216, 163, 0.35)' : 'none'
          }}>
            <Home size={24} strokeWidth={activeTab === 'dashboard' ? 2 : 1.5} />
          </div>
          <span>Tổng quan</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => onTabChange('transactions')}
          style={{ color: activeTab === 'transactions' ? 'var(--nav-color-transactions)' : 'var(--text-subtle)' }}
        >
          <div className="nav-icon-container" style={{
            backgroundColor: activeTab === 'transactions' ? 'var(--nav-bg-transactions)' : 'transparent',
            color: activeTab === 'transactions' ? 'var(--nav-color-transactions)' : 'var(--text-subtle)',
            boxShadow: activeTab === 'transactions' ? '0 4px 16px rgba(59, 130, 246, 0.35)' : 'none'
          }}>
            <ReceiptText size={24} strokeWidth={activeTab === 'transactions' ? 2 : 1.5} />
          </div>
          <span>Giao dịch</span>
        </button>

        <div style={{ width: '20%', display: 'flex', justifyContent: 'center' }}>
          <button className="fab-center" onClick={() => setIsAdding(true)}>
            <Plus size={26} strokeWidth={2.5} color="white" />
          </button>
        </div>

        <button
          className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => onTabChange('budget')}
          style={{ color: activeTab === 'budget' ? 'var(--nav-color-budget)' : 'var(--text-subtle)' }}
        >
          <div className="nav-icon-container" style={{
            backgroundColor: activeTab === 'budget' ? 'var(--nav-bg-budget)' : 'transparent',
            color: activeTab === 'budget' ? 'var(--nav-color-budget)' : 'var(--text-subtle)',
            boxShadow: activeTab === 'budget' ? '0 4px 16px rgba(139, 92, 246, 0.35)' : 'none'
          }}>
            <Target size={24} strokeWidth={activeTab === 'budget' ? 2 : 1.5} />
          </div>
          <span>Ngân sách</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onTabChange('settings')}
          style={{ color: activeTab === 'settings' ? 'var(--nav-color-settings)' : 'var(--text-subtle)' }}
        >
          <div className="nav-icon-container" style={{
            backgroundColor: activeTab === 'settings' ? 'var(--nav-bg-settings)' : 'transparent',
            color: activeTab === 'settings' ? 'var(--nav-color-settings)' : 'var(--text-subtle)',
            boxShadow: activeTab === 'settings' ? '0 4px 16px rgba(100, 116, 139, 0.35)' : 'none'
          }}>
            <Settings size={24} strokeWidth={activeTab === 'settings' ? 2 : 1.5} />
          </div>
          <span>Cài đặt</span>
        </button>
      </div>

      {isAdding && <TransactionModal onClose={() => setIsAdding(false)} />}
    </div>
  );
};
