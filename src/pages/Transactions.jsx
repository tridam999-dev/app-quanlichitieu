import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Filter, Pencil, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import TransactionModal from '../components/TransactionModal';

export default function Transactions() {
  const { transactions, formatCurrency, getCategoryTheme, getCategoryById, deleteTransaction } = useFinance();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredTransactions = transactions.filter(t => {
    const cat = getCategoryById(t.category_id);
    const matchesSearch = t.note?.toLowerCase().includes(search.toLowerCase()) || 
                          cat.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const renderIcon = (iconName, color = "white") => {
    const Icon = Icons[iconName] || Icons.MoreHorizontal;
    return <Icon size={24} strokeWidth={1.5} color={color} />;
  };

  return (
    <div className="page animate-fade-in">
      <div className="header">
        <h1 className="title">Giao dịch</h1>
      </div>

      <div style={{ paddingBottom: 'var(--space-16)' }}>
        <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', padding: '12px var(--space-16)', marginBottom: 'var(--space-16)' }}>
          <Search size={24} strokeWidth={1.5} className="text-muted" />
          <input 
            type="text" 
            placeholder="Tìm kiếm giao dịch..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--text-main)', fontSize: '15px' }}
          />
        </div>

        <div className="flex-start">
          <div style={{ flex: 1, display: 'flex', gap: 'var(--space-8)' }}>
            {['all', 'income', 'expense'].map(type => (
              <button 
                key={type}
                className="badge"
                style={{ 
                  background: filterType === type ? 'var(--primary)' : 'var(--border-color)',
                  color: filterType === type ? 'var(--bg-color)' : 'var(--text-muted)'
                }}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'Tất cả' : type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-column" style={{ gap: 'var(--space-8)' }}>
        {filteredTransactions.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--space-32)' }}>Không tìm thấy giao dịch nào.</p>
        ) : (
          filteredTransactions.map(tx => {
            const cat = getCategoryById(tx.category_id);
            const theme = getCategoryTheme(cat.group);
            return (
            <div key={tx.id} className="card interactive" onClick={() => setEditingTransaction(tx)} style={{ marginBottom: 0, cursor: 'pointer' }}>
              <div className="flex-between">
                <div className="flex-start">
                  <div className="icon-wrapper" style={{ background: theme.bg }}>
                    {renderIcon(cat.icon, theme.color)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-section-title)', textTransform: 'capitalize', color: 'var(--text-main)' }}>
                      {cat.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: 'var(--text-secondary)', marginTop: '4px' }}>
                      {tx.note || new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`amount ${tx.type === 'income' ? 'text-success' : ''}`} style={{ fontWeight: 700, fontSize: 'var(--text-section-title)' }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {editingTransaction && (
        <TransactionModal 
          editData={editingTransaction} 
          onClose={() => setEditingTransaction(null)} 
        />
      )}
    </div>
  );
}
