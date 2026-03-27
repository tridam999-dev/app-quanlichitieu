import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Calendar, Plus, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function RecurringTransactionsModal({ onClose }) {
  const { recurring, addRecurring, deleteRecurring, categories, getCategoryById, formatCurrency, getCategoryColor } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [frequency, setFrequency] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    addRecurring({
      amount: parseFloat(amount),
      category_id: categoryId,
      frequency
    });
    
    setIsAdding(false);
    setAmount('');
  };

  const renderIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.MoreHorizontal;
    return <Icon size={20} color="white" />;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content scroll-hidden" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex-between mb" style={{ marginBottom: 'var(--space-16)' }}>
          <h2 className="title" style={{ fontSize: '20px' }}>
            Quản lý chi tiêu định kỳ
          </h2>
          <button onClick={onClose} style={{ padding: 4, background: 'var(--bg-color)', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {!isAdding ? (
          <div>
            <button className="button-primary" onClick={() => setIsAdding(true)} style={{ marginBottom: 'var(--space-16)' }}>
              <Plus size={20} /> Thêm khoản mới
            </button>

            <div className="flex-column" style={{ gap: 'var(--space-8)' }}>
              {recurring.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: 'var(--space-24) 0' }}>Bạn chưa có khoản chi tiêu định kỳ nào.</p>
              ) : (
                recurring.map(item => {
                  const cat = getCategoryById(item.category_id);
                  return (
                    <div key={item.id} className="card" style={{ padding: 'var(--space-16)', marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="flex-start">
                        <div className="icon-wrapper" style={{ background: getCategoryColor(cat.name) }}>
                          {renderIcon(cat.icon)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>
                            {cat.name}
                          </div>
                          <div className="text-muted flex-start" style={{ fontSize: 13, gap: 4 }}>
                            <Calendar size={12} /> {item.frequency === 'monthly' ? 'Hàng tháng' : 'Hàng tuần'}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="amount text-danger" style={{ fontWeight: 600 }}>
                          -{formatCurrency(item.amount)}
                        </div>
                        <button onClick={() => deleteRecurring(item.id)} className="text-muted" style={{ marginTop: 8 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Số tiền</label>
              <input 
                type="number" 
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input-field"
                placeholder="0"
                autoFocus
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Danh mục</label>
              <select 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
                className="input-field"
              >
                {categories.filter(c => c.type === 'expense').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Tần suất</label>
              <select 
                value={frequency} 
                onChange={e => setFrequency(e.target.value)}
                className="input-field"
              >
                <option value="monthly">Hàng tháng</option>
                <option value="weekly">Hàng tuần</option>
              </select>
            </div>

            <div className="flex-start" style={{ gap: 'var(--space-8)', marginTop: 'var(--space-24)' }}>
              <button type="button" onClick={() => setIsAdding(false)} className="button-primary" style={{ background: 'var(--border-color)', color: 'var(--text-main)', flex: 1 }}>
                Huỷ
              </button>
              <button type="submit" className="button-primary" style={{ flex: 1 }}>
                Thêm ngay
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
