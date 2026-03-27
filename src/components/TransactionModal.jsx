import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Trash2, Mic, MicOff, Check, Edit2 } from 'lucide-react';
import * as Icons from 'lucide-react';

const parseVietnameseSpeech = (text, categories) => {
  let s = text.toLowerCase();
  // Thay thế dấu câu bằng khoảng trắng và bọc 2 đầu bằng khoảng trắng để dễ tìm từ nguyên vẹn (word boundary)
  let paddedS = ' ' + s.replace(/[.,!?]/g, ' ') + ' ';
  
  // 1. Determine Type
  let type = 'expense';
  const incomeKeywords = ['nhận', 'lương', 'thưởng', 'bán', 'thu', 'tiền vào', 'được cho'];
  if (incomeKeywords.some(kw => paddedS.includes(` ${kw} `))) {
    type = 'income';
  }

  // 2. Extract Amount
  let amount = 0;
  // Replace standard phrases
  let norm = s.replace(/một/g, '1').replace(/hai/g, '2').replace(/ba/g, '3')
       .replace(/bốn/g, '4').replace(/năm/g, '5').replace(/sáu/g, '6')
       .replace(/bảy/g, '7').replace(/tám/g, '8').replace(/chín/g, '9')
       .replace(/mười/g, '10').replace(/ mốt/g, ' 1').replace(/ rưỡi/g, ' 500')
       .replace(/\./g, '').replace(/,/g, '');

  const amtRegex = /(\d+)\s*(triệu|tr|củ|nghìn|ngàn|k)?/g;
  let matches = [...norm.matchAll(amtRegex)];
  
  if (matches.length > 0) {
      let val1 = parseFloat(matches[0][1]);
      let unit1 = matches[0][2];
      
      if (unit1 === 'triệu' || unit1 === 'tr' || unit1 === 'củ') {
          amount = val1 * 1000000;
          if (matches.length > 1) {
              let val2 = parseFloat(matches[1][1]);
              if (val2 < 10) amount += val2 * 100000;
              else if (val2 < 1000) amount += val2 * 1000;
          }
      } else if (unit1 === 'nghìn' || unit1 === 'ngàn' || unit1 === 'k') {
          amount = val1 * 1000;
      } else {
          if (norm.includes('triệu') || norm.includes('tr') || norm.includes('củ')) amount = val1 * 1000000;
          else if (norm.includes('nghìn') || norm.includes('k') || norm.includes('ngàn')) amount = val1 * 1000;
          else {
              amount = val1;
              if (amount > 0 && amount < 1000) amount *= 1000; 
          }
      }
  }

  // 3. Match Category
  let categoryId = null;
  const filteredCats = categories.filter(c => c.type === type);
  
  const keywordMap = {
      'ăn': 'Ăn uống', 'phở': 'Ăn uống', 'cơm': 'Ăn uống', 'bún': 'Ăn uống', 'nhậu': 'Ăn uống', 'kem': 'Ăn uống',
      'cafe': 'Cafe', 'cà phê': 'Cafe', 'trà sữa': 'Cafe', 'nước ép': 'Cafe', 'sinh tố': 'Cafe',
      'xăng': 'Di chuyển', 'đổ xăng': 'Di chuyển', 'gửi xe': 'Di chuyển', 'vé xe': 'Di chuyển',
      'grab': 'Di chuyển', 'taxi': 'Di chuyển', 'be': 'Di chuyển', 'gojek': 'Di chuyển', 'xe ôm': 'Di chuyển',
      'điện thoại': 'Hóa đơn', 'thẻ cào': 'Hóa đơn', 'viettel': 'Hóa đơn', 'mobi': 'Hóa đơn', 'vina': 'Hóa đơn',
      'điện': 'Hóa đơn', 'tiền điện': 'Hóa đơn', 'hóa đơn': 'Hóa đơn',
      'tiền nước': 'Hóa đơn', 'internet': 'Hóa đơn', 'mạng': 'Hóa đơn', 'wifi': 'Hóa đơn', 'cáp': 'Hóa đơn',
      'siêu thị': 'Mua sắm', 'mua đồ': 'Mua sắm', 'tạp hóa': 'Mua sắm', 'vinmart': 'Mua sắm', 'bách hóa': 'Mua sắm',
      'áo': 'Mua sắm', 'quần': 'Mua sắm', 'giày': 'Mua sắm', 'mỹ phẩm': 'Mua sắm', 'skincare': 'Mua sắm',
      'lương': 'Lương', 'thưởng': 'Thưởng', 'đầu tư': 'Đầu tư', 'lợi nhuận': 'Đầu tư',
      'xem phim': 'Giải trí', 'giải trí': 'Giải trí', 'vé': 'Giải trí', 'chơi': 'Giải trí', 'du lịch': 'Giải trí',
      'nhà': 'Gia đình', 'trọ': 'Hóa đơn', 'tiền nhà': 'Hóa đơn', 'gia đình': 'Gia đình', 'cho mẹ': 'Gia đình', 'cho ba': 'Gia đình',
      'ốm': 'Sức khỏe', 'thuốc': 'Sức khỏe', 'viện': 'Sức khỏe', 'khám': 'Sức khỏe', 'bảo hiểm': 'Sức khỏe',
      'học': 'Học tập', 'sách': 'Học tập', 'khóa học': 'Học tập', 'tiếng anh': 'Học tập'
  };

  // We sort keywords by length descending so "tiền điện" matches before "điện"
  const sortedKeywords = Object.entries(keywordMap).sort((a, b) => b[0].length - a[0].length);

  let categoryName = 'Khác';
  for (const [kw, catName] of sortedKeywords) {
      // Dùng paddedS để đảm bảo khớp "từ nguyên vẹn", tránh "bán" khớp "bánh", "thu" khớp "thuê"
      if (paddedS.includes(` ${kw} `)) {
          // Verify that this category exists in the local user categories
          if (filteredCats.some(c => c.name === catName)) {
              categoryName = catName;
              break;
          }
      }
  }
  
  const matchedCat = filteredCats.find(c => c.name === categoryName);
  const otherCat = filteredCats.find(c => c.name === 'Khác');

  if (matchedCat) {
      categoryId = matchedCat.id;
  } else if (otherCat) {
      categoryId = otherCat.id;
  } else if (filteredCats.length > 0) {
      categoryId = filteredCats[0].id;
  }

  // Capitalize first letter of note
  let capNote = text.trim();
  if (capNote.length > 0) capNote = capNote.charAt(0).toUpperCase() + capNote.slice(1);

  return { type, amount, category_id: categoryId, note: capNote };
};

export default function TransactionModal({ onClose, editData = null, initialType = 'expense', initialCategoryId = null }) {
  const { addTransaction, updateTransaction, deleteTransaction, categories, getCategoryTheme, getCategoryById, settings, formatCurrency } = useFinance();
  
  const [type, setType] = useState(editData?.type || initialType);
  const [amount, setAmount] = useState(editData?.amount ? String(editData.amount) : '');
  const [categoryId, setCategoryId] = useState(editData?.category_id || initialCategoryId || categories.find(c => c.type === (editData?.type || initialType))?.id);
  const [note, setNote] = useState(editData?.note || '');
  const [date, setDate] = useState(editData?.date?.substring(0, 10) || new Date().toISOString().substring(0, 10));

  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceResult, setVoiceResult] = useState(null);

  const amountRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if(!voiceMode && amountRef.current) {
      amountRef.current.focus();
    }
  }, [voiceMode]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);
      
      recognitionRef.current.onresult = (e) => {
        let combined = '';
        for (let i = 0; i < e.results.length; ++i) {
          combined += e.results[i][0].transcript;
        }
        setTranscript(combined);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [categories]);

  const toggleVoiceMode = () => {
    if (voiceMode) {
      setVoiceMode(false);
      recognitionRef.current?.stop();
    } else {
      setVoiceMode(true);
      setVoiceResult(null);
      setTranscript('');
      recognitionRef.current?.start();
    }
  };

  const stopAndParse = () => {
    recognitionRef.current?.stop();
    if (transcript.trim()) {
      const result = parseVietnameseSpeech(transcript, categories);
      setVoiceResult(result);
    }
  };

  const startListening = () => {
    setVoiceResult(null);
    setTranscript('');
    recognitionRef.current?.start();
  };

  const handleApplyVoiceResult = () => {
     if(voiceResult) {
       setType(voiceResult.type);
       setAmount(String(voiceResult.amount || 0));
       if(voiceResult.category_id) setCategoryId(voiceResult.category_id);
       setNote(voiceResult.note);
       setVoiceMode(false); 
     }
  };

  const handleSaveVoiceResult = () => {
     if(!voiceResult) return;
     if(!voiceResult.amount || voiceResult.amount === 0) {
        handleApplyVoiceResult();
        return;
     }

     const finalData = {
       type: voiceResult.type,
       amount: parseFloat(voiceResult.amount),
       category_id: voiceResult.category_id || categories.find(c => c.type === voiceResult.type)?.id,
       note: voiceResult.note,
       date: new Date(date).toISOString()
     };
     addTransaction(finalData);
     onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  const handleNoteChange = (text) => {
    setNote(text);
    if (!editData) {
      const parsed = parseVietnameseSpeech(text, categories);
      const cat = categories.find(c => c.id === parsed.category_id);
      if (cat && cat.type === type && cat.name !== 'Khác') {
         setCategoryId(parsed.category_id);
      }
    }
  };

  const handleQuickAdd = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    const isIncome = type === 'income';
    const finalCategoryId = isIncome && !filteredCategories.some(c => c.id === categoryId) 
      ? categories.find(c => c.type === 'income').id 
      : categoryId;

    const data = {
      type,
      amount: parseFloat(amount),
      category_id: finalCategoryId,
      note,
      date: new Date(date).toISOString()
    };

    if (editData) {
      updateTransaction(editData.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  const renderIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.Tag;
    return <Icon size={24} strokeWidth={1.5} />;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content scroll-hidden animate-fade-in" style={{ maxHeight: '95vh', overflowY: 'auto' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-16)' }}>
          <h2 className="title" style={{ fontSize: '20px', fontWeight: 700 }}>
            {voiceMode ? 'Ghi bằng giọng nói' : editData ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}
          </h2>
          <div className="flex-start">
            <button 
                type="button" 
                onClick={toggleVoiceMode} 
                style={{ 
                    padding: '8px', 
                    background: voiceMode ? 'var(--primary-light)' : 'var(--bg-color)', 
                    color: voiceMode ? 'var(--primary)' : 'var(--text-muted)', 
                    borderRadius: '50%', 
                    border: 'none', 
                    display: 'flex', 
                    transition: 'all 200ms ease',
                    boxShadow: voiceMode ? '0 4px 12px rgba(11, 31, 58, 0.15)' : 'none'
                }}>
              <Mic size={24} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={onClose} style={{ padding: '8px', background: 'var(--bg-color)', borderRadius: '50%', border: 'none', display: 'flex' }}>
              <X size={24} strokeWidth={1.5} className="text-muted" />
            </button>
          </div>
        </div>

        {voiceMode ? (
            <div className="flex-column" style={{ alignItems: 'center', minHeight: '50vh', padding: 'var(--space-24) 0', position: 'relative' }}>
                {!voiceResult ? (
                    <>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div className={`pulse-ring ${isListening ? 'active' : ''}`} onClick={isListening ? stopAndParse : startListening} style={{ width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isListening ? 'var(--primary)' : 'var(--primary-light)', color: isListening ? 'white' : 'var(--primary)', cursor: 'pointer', marginBottom: 'var(--space-24)', transition: 'all 0.3s ease' }}>
                                <Mic size={36} strokeWidth={2} />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-main)', marginBottom: 'var(--space-8)' }}>
                                {isListening ? 'Đang nghe... (Chạm để chốt)' : 'Nhấn để nói'}
                            </h3>
                            <p className="text-muted" style={{ textAlign: 'center', minHeight: 40, fontSize: '15px', color: transcript ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                {transcript || 'Ví dụ: "Hôm nay tôi ăn trưa 50 nghìn"'}
                            </p>
                            <div className="text-muted" style={{ fontSize: '12px', marginTop: 'var(--space-16)', opacity: 0.7 }}>
                                Giọng nói chỉ dùng để tạo giao dịch
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ width: '100%', animation: 'slideUp 0.3s ease' }}>
                        <div className="card" style={{ padding: 'var(--space-24)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', marginBottom: 'var(--space-24)' }}>
                           <h3 className="section-title text-center" style={{ marginBottom: 'var(--space-16)' }}>Chi tiết giao dịch</h3>
                           
                           {/* Preview Card */}
                           {(() => {
                               const cat = getCategoryById(voiceResult.category_id);
                               const theme = cat ? getCategoryTheme(cat.group) : getCategoryTheme('Khác');
                               return (
                                   <div className="flex-column" style={{ alignItems: 'center', gap: 'var(--space-16)' }}>
                                        <div className="icon-wrapper" style={{ background: theme.bg, color: theme.color, width: 64, height: 64, borderRadius: 20 }}>
                                            {renderIcon(cat?.icon || 'Tag')}
                                        </div>
                                        <div className="text-center">
                                            <div style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text-main)' }}>{cat?.name || 'Khác'}</div>
                                            <div className="text-muted" style={{ fontSize: '14px', marginTop: 4 }}>{voiceResult.note}</div>
                                        </div>
                                        <div className={`amount ${voiceResult.type === 'income' ? 'text-success' : 'text-primary'}`} style={{ fontSize: '32px', fontWeight: 700 }}>
                                            {voiceResult.type === 'income' ? '+' : '-'}{formatCurrency(voiceResult.amount || 0)}
                                        </div>
                                   </div>
                               )
                           })()}
                        </div>

                        <div className="flex-start" style={{ gap: 'var(--space-16)' }}>
                            <button onClick={handleApplyVoiceResult} className="button-primary" style={{ flex: 1, background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                                <Edit2 size={18} style={{ marginRight: 8 }} /> Sửa
                            </button>
                            <button onClick={handleSaveVoiceResult} className="button-primary" style={{ flex: 1 }}>
                                <Check size={18} style={{ marginRight: 8 }} /> Lưu giao dịch
                            </button>
                        </div>
                        <div className="text-center" style={{ marginTop: 'var(--space-16)' }}>
                            <button onClick={startListening} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600 }}>Nghe lại</button>
                        </div>
                    </div>
                )}
            </div>
        ) : (
        <form onSubmit={handleSubmit} className="animate-fade-in">
          {/* Segmented Control */}
          <div className="flex-start" style={{ marginBottom: 'var(--space-24)', background: 'var(--bg-color)', padding: 4, borderRadius: 'var(--radius-btn)' }}>
            {['expense', 'income'].map(t => (
              <button
                key={t}
                type="button"
                className={`button-primary`}
                style={{
                  flex: 1, padding: '12px', background: type === t ? (t === 'expense' ? 'var(--card-bg)' : 'var(--card-bg)') : 'transparent',
                  color: type === t ? (t === 'expense' ? 'var(--text-main)' : 'var(--success)') : 'var(--text-muted)', 
                  boxShadow: type === t ? 'var(--shadow-sm)' : 'none',
                  fontWeight: type === t ? 600 : 500, fontSize: '15px'
                }}
                onClick={() => {
                  setType(t);
                  const firstCat = categories.find(c => c.type === t);
                  if (firstCat && !filteredCategories.some(c => c.id === categoryId)) {
                    setCategoryId(firstCat.id);
                  }
                }}
              >
                {t === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
              </button>
            ))}
          </div>

          <div className="flex-column" style={{ gap: 'var(--space-24)' }}>
            {/* Amount & Quick Add */}
            <div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 'var(--space-16)', borderBottom: `2px solid ${type === 'income' ? 'var(--success)' : 'var(--primary)'}`, paddingBottom: 'var(--space-8)' }}>
                <span className="text-muted" style={{ fontSize: '24px', fontWeight: 500, paddingBottom: 6, marginRight: 4 }}>
                  {settings.currency === 'VND' ? '₫' : settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : '£'}
                </span>
                <input 
                  ref={amountRef}
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ 
                    border: 'none', background: 'transparent', outline: 'none', 
                    fontSize: '48px', fontWeight: 700, color: type === 'income' ? 'var(--success)' : 'var(--text-main)', 
                    width: '100%', textAlign: 'center', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em',
                    caretColor: type === 'income' ? 'var(--success)' : 'var(--primary)'
                  }}
                  placeholder="0"
                  required
                />
              </div>

              {/* Quick Add Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'center' }}>
                {[50000, 100000, 200000, 500000].map(val => (
                  <button 
                    key={val} 
                    type="button" 
                    onClick={() => handleQuickAdd(settings.currency === 'VND' ? val : val/10000)}
                    style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-icon)', padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', transition: 'background var(--transition-fast)' }}
                  >
                    +{settings.currency === 'VND' ? (val/1000) + 'k' : (val/10000) }
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection horizontal scroll */}
            <div>
              <label className="input-label" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>Chọn danh mục</label>
              <div style={{ display: 'flex', gap: 'var(--space-16)', overflowX: 'auto', paddingBottom: 'var(--space-16)', scrollbarWidth: 'none', margin: '0 -16px', padding: '0 16px' }}>
                {filteredCategories.map(c => {
                  const isSelected = categoryId === c.id;
                  const theme = getCategoryTheme(c.group);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      className="icon-interactive"
                      style={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)', 
                        minWidth: '64px', opacity: isSelected ? 1 : 0.6,
                        transition: 'opacity var(--transition-fast)'
                      }}
                    >
                      <div className="icon-wrapper" style={{ 
                        background: isSelected ? theme.bg : 'var(--bg-color)', 
                        color: isSelected ? theme.color : 'var(--text-muted)'
                      }}>
                        {renderIcon(c.icon)}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: isSelected ? 600 : 500, color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional fields */}
            <div className="flex-start" style={{ gap: 'var(--space-16)' }}>
              <div style={{ flex: 1 }}>
                <label className="input-label" style={{ fontSize: '12px' }}>Ngày giao dịch</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="input-field"
                  style={{ padding: '12px var(--space-16)', borderRadius: '12px', fontSize: '14px', fontWeight: 500 }}
                  required
                />
              </div>

              <div style={{ flex: 2 }}>
                <label className="input-label" style={{ fontSize: '12px' }}>Ghi chú (Tuỳ chọn)</label>
                <input 
                  type="text" 
                  value={note}
                  onChange={e => handleNoteChange(e.target.value)}
                  className="input-field"
                  placeholder="Thêm diễn giải..."
                  style={{ padding: '12px var(--space-16)', borderRadius: '12px', fontSize: '14px' }}
                />
              </div>
            </div>
          </div>

          <div className="flex-start" style={{ marginTop: 'var(--space-32)', gap: 'var(--space-8)' }}>
            <button type="submit" className="button-primary" style={{ flex: 1, padding: '18px', fontSize: '16px', boxShadow: 'var(--shadow-md)' }}>
              {editData ? 'Cập nhật' : 'Xác nhận'}
            </button>
            {editData && (
              <button 
                type="button" 
                onClick={() => {
                  deleteTransaction(editData.id);
                  onClose();
                }}
                className="button-primary" 
                style={{ background: 'var(--bg-color)', color: 'var(--danger)', width: 60, padding: 0 }}
              >
                <Trash2 size={24} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
