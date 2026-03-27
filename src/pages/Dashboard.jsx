import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, ChevronRight, Wallet, QrCode } from 'lucide-react';
import * as Icons from 'lucide-react';
import TransactionModal from '../components/TransactionModal';

export default function Dashboard({ onNavigate }) {
  const { totalBalance, monthlyIncome, monthlyExpenses, transactions, formatCurrency, getCategoryTheme, getCategoryById, generateInsights, categories } = useFinance();

  const [quickAddOptions, setQuickAddOptions] = React.useState(null);

  const recentTransactions = transactions.slice(0, 5);
  const insights = generateInsights();

  const renderIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.MoreHorizontal;
    return <Icon size={24} strokeWidth={1.5} />;
  };

  return (
    <div className="page animate-fade-in">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
        <h1 className="title" style={{ margin: 0 }}>Tổng quan</h1>
        <button className="interactive" onClick={() => onNavigate('ai-chat')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '8px 16px', borderRadius: 20, fontWeight: 600, fontSize: 13, boxShadow: 'var(--shadow-sm)' }}>
           <Icons.Sparkles size={16} strokeWidth={2} /> Hỏi AI
        </button>
      </div>

      {/* Main Balance Card  */}
      <div className="card" style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: 'var(--radius-card)', padding: 'var(--space-24)', boxShadow: 'var(--shadow-glow)', marginBottom: 'var(--space-16)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        <div className="flex-start" style={{ opacity: 0.8, fontSize: 'var(--text-card-title)', marginBottom: 'var(--space-8)', fontWeight: 500, zIndex: 1 }}>
           Số dư hiện tại
        </div>
        <div className="amount large" style={{ zIndex: 1 }}>{formatCurrency(totalBalance)}</div>
      </div>

      {/* Income & Expense Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', marginBottom: 'var(--space-32)' }}>
        <div className="card" style={{ padding: 'var(--space-16)', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
          <div className="flex-start text-muted" style={{ fontSize: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontWeight: 500 }}>
            <div className="icon-wrapper" style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--success-light)', color: 'var(--success)' }}>
              <TrendingUp size={16} strokeWidth={2} />
            </div>
            Thu nhập
          </div>
          <div className="amount text-success" style={{ fontSize: 'var(--text-amount)' }}>+{formatCurrency(monthlyIncome)}</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-16)', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
          <div className="flex-start text-muted" style={{ fontSize: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontWeight: 500 }}>
            <div className="icon-wrapper" style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(15, 23, 42, 0.05)', color: 'var(--text-main)' }}>
               <TrendingDown size={16} strokeWidth={2} />
            </div>
            Chi tiêu
          </div>
          <div className="amount" style={{ fontSize: 'var(--text-amount)', color: 'var(--text-main)' }}>-{formatCurrency(monthlyExpenses)}</div>
        </div>
      </div>
      
      {/* Quick Spend Categories */}
      <div style={{ marginBottom: 'var(--space-32)' }}>
        <h2 className="section-title" style={{ marginBottom: 'var(--space-16)' }}>Chi tiêu nhanh</h2>
        <div style={{ margin: '0 -var(--space-16)', padding: '0 var(--space-16)' }}>
          <div className="scroll-hidden" style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gridAutoFlow: 'column', gap: 'var(--space-16)', overflowX: 'auto', paddingBottom: 'var(--space-8)' }}>
            {categories.filter(c => c.type === 'expense').map(c => {
               const theme = getCategoryTheme(c.group);
               return (
              <button 
                key={c.id} 
                onClick={() => setQuickAddOptions({ type: c.type, categoryId: c.id })}
                className="icon-interactive"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)', minWidth: 64 }}
              >
                <div className="icon-wrapper" style={{ background: theme.bg, color: theme.color }}>
                  {renderIcon(c.icon)}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{c.name}</span>
              </button>
            )})}
          </div>
        </div>
      </div>
      
      {/* AI Insights Section */}
      <div style={{ marginBottom: 'var(--space-32)' }}>
        <h2 className="section-title flex-start" style={{ marginBottom: 'var(--space-16)' }}>
          Phân tích thông minh
        </h2>
        <div className="flex-column">
          {insights.map(insight => (
            <div key={insight.id} className="card" style={{ background: insight.type === 'warning' ? 'var(--danger-light)' : insight.type === 'success' || insight.type === 'positive' ? 'var(--success-light)' : 'var(--primary-light)', color: insight.type === 'warning' ? 'var(--text-main)' : insight.type === 'success' || insight.type === 'positive' ? 'var(--primary)' : 'var(--text-main)', border: 'none', padding: '16px var(--space-16)', marginBottom: 0 }}>
              <div className="flex-start" style={{ alignItems: 'flex-start', fontSize: 'var(--text-card-title)' }}>
                {insight.type === 'warning' ? (
                  <div style={{ background: 'var(--card-bg)', borderRadius: '50%', padding: 6, display: 'flex', color: 'var(--danger)', boxShadow: 'var(--shadow-sm)', marginTop: 2, flexShrink: 0 }}><Icons.AlertTriangle size={18} strokeWidth={1.5} /></div>
                ) : (
                  <div style={{ background: 'var(--card-bg)', borderRadius: '50%', padding: 6, display: 'flex', color: 'var(--success)', boxShadow: 'var(--shadow-sm)', marginTop: 2, flexShrink: 0 }}><Icons.Sparkles size={18} strokeWidth={1.5} /></div>
                )}
                <span style={{ lineHeight: 1.5, fontWeight: 500 }}>{insight.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', marginBottom: 'var(--space-32)' }}>
        <div className="card flex-start interactive" onClick={() => onNavigate('qr')} style={{ cursor: 'pointer', padding: '12px var(--space-16)', marginBottom: 0, gap: '12px' }}>
          <div className="icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <QrCode size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 600 }}>Quét QR</h3>
        </div>

        <div className="card flex-start interactive" onClick={() => onNavigate('reports')} style={{ cursor: 'pointer', padding: '12px var(--space-16)', marginBottom: 0, gap: '12px' }}>
          <div className="icon-wrapper" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <Wallet size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 600 }}>Báo cáo</h3>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex-between" style={{ marginBottom: 'var(--space-16)' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Giao dịch gần đây</h2>
          <button className="text-primary" onClick={() => onNavigate('transactions')} style={{ fontSize: 'var(--text-card-title)', fontWeight: 600, background: 'none', border: 'none' }}>Tất cả</button>
        </div>

        <div className="flex-column" style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-card)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.02)' }}>
          {recentTransactions.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: 'var(--space-32) 0' }}>Chưa có giao dịch.</p>
          ) : (
            recentTransactions.map((tx, index) => {
              const cat = getCategoryById(tx.category_id);
              const theme = getCategoryTheme(cat.group);
              const isLast = index === recentTransactions.length - 1;
              return (
                <div key={tx.id} className="interactive" style={{ padding: '12px var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isLast ? 'none' : '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <div className="flex-start" style={{ gap: '12px' }}>
                    <div className="icon-wrapper" style={{ background: theme.bg, color: theme.color }}>
                      {renderIcon(cat.icon)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '15px', textTransform: 'capitalize', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                        {cat.name}
                      </div>
                      <div className="text-subtle" style={{ fontSize: '13px', marginTop: '2px', fontWeight: 500 }}>
                        {tx.note || new Date(tx.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`amount ${tx.type === 'income' ? 'text-success' : ''}`} style={{ fontWeight: 600, fontSize: '16px' }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {quickAddOptions && (
        <TransactionModal 
          onClose={() => setQuickAddOptions(null)} 
          initialType={quickAddOptions.type}
          initialCategoryId={quickAddOptions.categoryId}
        />
      )}
    </div>
  );
}
