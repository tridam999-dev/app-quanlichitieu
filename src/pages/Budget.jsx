import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, AlertCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function Budget() {
  const { budgets, getExpensesByCategory, formatCurrency, categories, setBudget, getCategoryColor, getCategoryById } = useFinance();
  const [editingCategory, setEditingCategory] = useState(null);
  const [newLimit, setNewLimit] = useState('');

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!newLimit || isNaN(newLimit)) return;
    setBudget(editingCategory, parseFloat(newLimit));
    setEditingCategory(null);
    setNewLimit('');
  };

  const renderIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.MoreHorizontal;
    return <Icon size={20} color="white" />;
  };

  return (
    <div className="page animate-fade-in">
      <div className="header">
        <h1 className="title">Ngân sách</h1>
      </div>

      <div>
        <div className="flex-column" style={{ gap: 'var(--space-16)' }}>
        {budgets.map(budget => {
          const expense = getExpensesByCategory(budget.category_id);
          const progress = Math.min((expense / budget.limit_amount) * 100, 100);
          const isWarning = progress >= 80 && progress < 100;
          const isDanger = progress >= 100;
          const cat = getCategoryById(budget.category_id);

          return (
            <div key={budget.category_id} className="card" style={{ marginBottom: 0, padding: 'var(--space-16)' }}>
              <div className="flex-between" style={{ marginBottom: 'var(--space-16)' }}>
                <div className="flex-start text-primary">
                  <div className="icon-wrapper" style={{ background: getCategoryColor(cat.name) }}>
                    {renderIcon(cat.icon)}
                  </div>
                  <h3 className="section-title" style={{ marginBottom: 0 }}>{cat.name}</h3>
                </div>
                <button onClick={() => setEditingCategory(budget.category_id)} className="text-muted" style={{ padding: '8px', marginRight: '-8px' }}>
                  <Icons.Pencil size={18} />
                </button>
              </div>

              <div className="flex-between" style={{ marginBottom: 'var(--space-8)', fontSize: 'var(--text-secondary)', fontWeight: 500 }}>
                <span className="text-muted">Đã chi: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{formatCurrency(expense)}</span></span>
                <span className="text-muted">Giới hạn: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{formatCurrency(budget.limit_amount)}</span></span>
              </div>

              <div style={{ height: 8, background: 'var(--primary-light)', borderRadius: '8px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${progress}%`,
                    background: isDanger ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--primary)',
                    transition: 'width 0.4s ease-out',
                    borderRadius: '8px'
                  }} 
                />
              </div>

              {(isDanger || isWarning) && (
                <div className="flex-start" style={{ marginTop: 'var(--space-16)', fontSize: 'var(--text-secondary)', fontWeight: 600, color: isDanger ? 'var(--danger)' : 'var(--warning)' }}>
                  <AlertCircle size={16} />
                  <span>{isDanger ? 'Bạn đã vượt quá ngân sách!' : 'Bạn sắp chạm trần ngân sách.'}</span>
                </div>
              )}
            </div>
          );
        })}

        <div className="card interactive" style={{ padding: 'var(--space-16)', border: '2px dashed var(--border-color)', boxShadow: 'none', textAlign: 'center', background: 'transparent', cursor: 'pointer', marginBottom: 0 }} onClick={() => setEditingCategory('new')}>
          <div className="flex-start" style={{ justifyContent: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Target size={20} /> Thiết lập ngân sách mới
          </div>
        </div>
        </div>
      </div>

      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="title" style={{ fontSize: 'var(--text-page-title)', marginBottom: 'var(--space-24)' }}>
              {editingCategory === 'new' ? 'Ngân sách mới' : 'Sửa ngân sách'}
            </h2>
            <form onSubmit={handleSetBudget}>
              {editingCategory === 'new' && (
                <div className="input-group">
                  <label className="input-label">Danh mục</label>
                  <select 
                    onChange={(e) => setEditingCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="new" disabled>Chọn danh mục</option>
                    {categories.filter(c => c.type === 'expense' && !budgets.find(b => b.category_id === c.id)).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="input-group">
                <label className="input-label">Giới hạn hàng tháng</label>
                <input 
                  type="number" 
                  value={newLimit}
                  onChange={e => setNewLimit(e.target.value)}
                  className="input-field"
                  placeholder="0"
                  autoFocus
                  required
                />
              </div>
              <div className="flex-start" style={{ gap: 'var(--space-16)', marginTop: 'var(--space-32)' }}>
                <button type="button" onClick={() => setEditingCategory(null)} className="button-primary" style={{ background: 'var(--border-color)', color: 'var(--text-main)', flex: 1 }}>
                  Huỷ
                </button>
                <button type="submit" className="button-primary" style={{ flex: 1 }}>
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
