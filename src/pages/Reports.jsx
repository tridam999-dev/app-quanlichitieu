import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export default function Reports() {
  const { getExpensesByCategory, formatCurrency, getCategoryColor, transactions } = useFinance();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Pie chart data: expenses by category this month
  const expensesData = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category_id);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category_id, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Bar chart data: last 7 days total spending
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    return d;
  }).reverse();

  const trendData = last7Days.map(date => {
    const dayStr = date.toLocaleDateString('vi-VN', { weekday: 'short' });
    const total = transactions
      .filter(t => t.type === 'expense')
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === date.getDate() && tDate.getMonth() === date.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: dayStr, Trao_đổi: total };
  });

  return (
    <div className="page animate-fade-in">
      <div className="header">
        <h1 className="title">Báo cáo</h1>
      </div>

      <div style={{ paddingBottom: 'var(--space-16)' }}>
        {expensesData.length > 0 ? (
          <>
            <div className="card" style={{ padding: 'var(--space-16)', marginBottom: 'var(--space-16)' }}>
              <h3 className="section-title">Chi tiêu theo danh mục</h3>
              <div style={{ height: 250, width: '100%', marginTop: 'var(--space-16)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ padding: 'var(--space-24)', marginBottom: 'var(--space-16)', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="section-title">Xu hướng chi tiêu (7 ngày)</h3>
              <div style={{ height: 250, width: '100%', marginTop: 'var(--space-16)', marginLeft: '-12px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 500 }} dy={10} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)', background: 'var(--card-bg)', color: 'var(--text-main)', fontWeight: 600 }}
                      itemStyle={{ color: 'var(--danger)' }}
                    />
                    <Area type="monotone" dataKey="Trao_đổi" stroke="var(--danger)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, fill: 'white', stroke: 'var(--danger)', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center" style={{ padding: 'var(--space-32)', color: 'var(--text-muted)' }}>
            <p>Chưa có dữ liệu giao dịch cho báo cáo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
