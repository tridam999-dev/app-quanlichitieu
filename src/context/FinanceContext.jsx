import React, { createContext, useContext, useState, useEffect } from 'react';

const COMMON_CATEGORIES = [
  { id: 'c_food', name: 'Ăn uống', icon: 'Utensils', type: 'expense', group: 'food' },
  { id: 'c_cafe', name: 'Cafe', icon: 'Coffee', type: 'expense', group: 'food' },
  { id: 'c_shop', name: 'Mua sắm', icon: 'ShoppingBag', type: 'expense', group: 'shopping' },
  { id: 'c_trans', name: 'Di chuyển', icon: 'Car', type: 'expense', group: 'transport' },
  { id: 'c_bill', name: 'Hóa đơn', icon: 'Zap', type: 'expense', group: 'bills' },
  { id: 'c_health', name: 'Sức khỏe', icon: 'HeartPulse', type: 'expense', group: 'health' },
  { id: 'c_edu', name: 'Học tập', icon: 'BookOpen', type: 'expense', group: 'education' },
  { id: 'c_fam', name: 'Gia đình', icon: 'Users', type: 'expense', group: 'family' },
  { id: 'c_ent', name: 'Giải trí', icon: 'Gamepad2', type: 'expense', group: 'entertainment' },
  { id: 'c_other_exp', name: 'Khác', icon: 'MoreHorizontal', type: 'expense', group: 'other' },
  
  { id: 'c_salary', name: 'Lương', icon: 'Wallet', type: 'income', group: 'finance' },
  { id: 'c_bonus', name: 'Thưởng', icon: 'Star', type: 'income', group: 'entertainment' },
  { id: 'c_invest', name: 'Đầu tư', icon: 'TrendingUp', type: 'income', group: 'finance' },
  { id: 'c_other_inc', name: 'Khác', icon: 'PlusCircle', type: 'income', group: 'other' }
];

const MOCK_USER_ID = 'user_123';

const initialTransactions = [
  { id: crypto.randomUUID(), user_id: MOCK_USER_ID, category_id: 'c_food', amount: 150.5, note: 'Ăn trưa', date: new Date().toISOString(), type: 'expense', created_at: new Date().toISOString() },
  { id: crypto.randomUUID(), user_id: MOCK_USER_ID, category_id: 'c_trans', amount: 25, note: 'Grab', date: new Date(Date.now() - 86400000).toISOString(), type: 'expense', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: crypto.randomUUID(), user_id: MOCK_USER_ID, category_id: 'c_salary', amount: 3000, note: 'Lương tháng', date: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'income', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
];

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('finance_categories_v6');
    return saved ? JSON.parse(saved) : COMMON_CATEGORIES;
  });
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions_v6');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finance_budgets_v6');
    return saved ? JSON.parse(saved) : [];
  });

  const [recurring, setRecurring] = useState(() => {
    const saved = localStorage.getItem('finance_recurring_v6');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('finance_settings_v6');
    return saved ? JSON.parse(saved) : { currency: 'VND', theme: 'light', hasSeenOnboarding: false };
  });

  useEffect(() => {
    localStorage.setItem('finance_categories_v6', JSON.stringify(categories));
    localStorage.setItem('finance_transactions_v6', JSON.stringify(transactions));
    localStorage.setItem('finance_budgets_v6', JSON.stringify(budgets));
    localStorage.setItem('finance_recurring_v6', JSON.stringify(recurring));
    localStorage.setItem('finance_settings_v6', JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [categories, transactions, budgets, recurring, settings]);

  const addTransaction = (t) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      user_id: MOCK_USER_ID,
      category_id: t.category_id,
      amount: parseFloat(t.amount),
      note: t.note,
      date: t.date,
      type: t.type,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (updated) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const setBudget = (category_id, limit_amount) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category_id === category_id);
      if (existing) {
        return prev.map(b => b.category_id === category_id ? { ...b, limit_amount } : b);
      }
      return [...prev, { id: crypto.randomUUID(), user_id: MOCK_USER_ID, category_id, limit_amount, month: new Date().toISOString() }];
    });
  };

  const addRecurring = (item) => {
    setRecurring(prev => [{ id: crypto.randomUUID(), user_id: MOCK_USER_ID, ...item, start_date: new Date().toISOString() }, ...prev]);
  };

  const deleteRecurring = (id) => {
    setRecurring(prev => prev.filter(r => r.id !== id));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateCategories = (newCategories) => {
    setCategories(newCategories);
  };

  const getCategoryTheme = (group) => {
    // Return { bg, color }
    const themes = {
      food: { bg: '#FFE8D6', color: '#B45309' }, // soft orange -> dark amber
      transport: { bg: '#E0F2FE', color: '#0369A1' }, // soft blue -> dark blue
      shopping: { bg: '#FCE7F3', color: '#BE185D' }, // soft pink -> dark pink
      bills: { bg: '#FEF9C3', color: '#A16207' }, // soft yellow -> dark yellow
      health: { bg: '#FEE2E2', color: '#B91C1C' }, // soft red -> dark red
      education: { bg: '#F3E8FF', color: '#7E22CE' }, // soft purple -> dark purple
      finance: { bg: '#DCFCE7', color: '#15803D' }, // soft mint green -> dark green
      family: { bg: '#CCFBF1', color: '#0F766E' }, // soft teal -> dark teal
      entertainment: { bg: '#EDE9FE', color: '#6D28D9' }, // soft violet
      other: { bg: '#F1F5F9', color: '#475569' } // neutral gray
    };
    return themes[group] || themes.other;
  };

  const getCategoryColor = (categoryName) => {
     const cat = categories.find(c => c.name === categoryName);
     if(cat) return getCategoryTheme(cat.group).color;
     return '#475569';
  };
  
  const getCategoryBg = (categoryName) => {
     const cat = categories.find(c => c.name === categoryName);
     if(cat) return getCategoryTheme(cat.group).bg;
     return '#F1F5F9';
  };

  const suggestIconForName = (name) => {
    const text = name.toLowerCase();
    if(text.includes('ăn') || text.includes('uống') || text.includes('thực phẩm')) return { icon: 'Utensils', group: 'food' };
    if(text.includes('xe') || text.includes('đi lại') || text.includes('di chuyển')) return { icon: 'Car', group: 'transport' };
    if(text.includes('nhà') || text.includes('thuê') || text.includes('ở')) return { icon: 'Home', group: 'family' };
    if(text.includes('học') || text.includes('sách') || text.includes('giáo')) return { icon: 'BookOpen', group: 'education' };
    if(text.includes('điện') || text.includes('nước') || text.includes('internet')) return { icon: 'Zap', group: 'bills' };
    if(text.includes('quà') || text.includes('biếu')) return { icon: 'Gift', group: 'family' };
    if(text.includes('thú')) return { icon: 'PawPrint', group: 'family' };
    if(text.includes('du lịch') || text.includes('đi chơi')) return { icon: 'Plane', group: 'entertainment' };
    if(text.includes('thuốc') || text.includes('khám') || text.includes('bệnh')) return { icon: 'Pill', group: 'health' };
    return { icon: 'MoreHorizontal', group: 'other' };
  };

  const getCategoryById = (id) => categories.find(c => c.id === id) || categories[0];

  const totalBalance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
  const monthlyIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const getExpensesByCategory = () => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      const catName = getCategoryById(t.category_id).name;
      acc[catName] = (acc[catName] || 0) + t.amount;
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([category, amount]) => ({
      category, amount, color: getCategoryColor(category)
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(settings.currency === 'USD' ? 'en-US' : 'en-GB', {
      style: 'currency', currency: settings.currency, minimumFractionDigits: 0
    }).format(amount);
  };
  
  const generateInsights = () => {
    if (transactions.length === 0) {
      return [{ id: '1', type: 'info', text: 'Hãy thêm vài giao dịch đầu tiên để AI có thể phân tích nhé.' }];
    }

    const insights = [];
    let idCounter = 1;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTx = transactions.filter(t => {
       const d = new Date(t.date);
       return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const lastMonthTx = transactions.filter(t => {
       const d = new Date(t.date);
       let lm = currentMonth - 1;
       let ly = currentYear;
       if (lm < 0) { lm = 11; ly--; }
       return d.getMonth() === lm && d.getFullYear() === ly;
    });

    const currentSpent = currentMonthTx.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const lastSpent = lastMonthTx.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    if (lastSpent > 0) {
       const increase = ((currentSpent - lastSpent) / lastSpent) * 100;
       if (increase > 20) {
           insights.push({ id: idCounter++, type: 'warning', text: `Chi tiêu đang tăng ${increase.toFixed(0)}% so với tháng trước. Hãy chú ý kiểm soát!` });
       } else if (increase < -10) {
           insights.push({ id: idCounter++, type: 'success', text: `Tuyệt vời! Chi tiêu tháng này đã giảm ${Math.abs(increase).toFixed(0)}% so với tháng trước.` });
       }
    }

    const categoryTotals = {};
    const categoryCounts = {};
    currentMonthTx.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category_id] = (categoryTotals[t.category_id] || 0) + t.amount;
        categoryCounts[t.category_id] = (categoryCounts[t.category_id] || 0) + 1;
    });

    let maxCountId = null; let maxCount = 0;
    Object.keys(categoryCounts).forEach(cid => {
       if (categoryCounts[cid] > maxCount && categoryCounts[cid] >= 3) {
           maxCount = categoryCounts[cid];
           maxCountId = cid;
       }
    });

    if (maxCountId) {
       const cat = categories.find(c => c.id === maxCountId);
       if (cat && maxCount > 3) {
           insights.push({ id: idCounter++, type: 'info', text: `Bạn thường chi tiêu nhiều vào ${cat.name} (${maxCount} lần/tháng).` });
       }
    }

    let sortedCats = Object.keys(categoryTotals).sort((a,b) => categoryTotals[b] - categoryTotals[a]);
    let luxuryExpId = sortedCats.find(id => {
       const c = categories.find(cat => cat.id === id);
       return c && (c.name === 'Cafe' || c.name === 'Trà sữa' || c.name === 'Ăn vặt' || c.name === 'Mua sắm' || c.name === 'Giải trí');
    });

    if (luxuryExpId && categoryTotals[luxuryExpId] > (settings.currency === 'VND' ? 500000 : 50)) {
        const c = categories.find(cat => cat.id === luxuryExpId);
        insights.push({ id: idCounter++, type: 'positive', text: `Gợi ý: Bạn có thể tiết kiệm đáng kể nếu giảm chi tiêu ${c.name}.` });
    }

    const currentIncome = currentMonthTx.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    if (currentIncome > 0 && currentSpent < currentIncome * 0.8) {
        insights.push({ id: idCounter++, type: 'success', text: `Tình hình khả quan! Bạn đang giữ lại được hơn 20% thu nhập trong tháng này.` });
    } else if (currentIncome > 0 && currentSpent > currentIncome * 0.9) {
        insights.push({ id: idCounter++, type: 'warning', text: `Báo động tài chính: Bạn đang tiêu gần hết thu nhập. Hãy đặt ngân sách!` });
    }

    if (insights.length === 0) {
        insights.push({ id: '1', type: 'info', text: 'Nhịp sống của bạn đang ổn định. Tiếp tục phát huy nhé!' });
    }
    
    // Sort logic to make warnings pop up first
    const critical = insights.filter(i => i.type === 'danger' || i.type === 'warning');
    const positive = insights.filter(i => i.type === 'success' || i.type === 'positive');
    const normal = insights.filter(i => i.type === 'info');

    return [...critical, ...positive, ...normal].slice(0, 3);
  };
  
  return (
    <FinanceContext.Provider value={{
      transactions, budgets, recurring, settings, categories,
      addTransaction, updateTransaction, deleteTransaction,
      setBudget, addRecurring, deleteRecurring, updateSettings, updateCategories, getCategoryById,
      getCategoryTheme, getCategoryBg, getCategoryColor,
      totalBalance, monthlyIncome, monthlyExpenses,
      getExpensesByCategory, formatCurrency, suggestIconForName,
      generateInsights
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
