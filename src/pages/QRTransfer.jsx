import React, { useState } from 'react';
import { ArrowLeft, QrCode, ScanLine, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function QRTransfer({ onBack }) {
  const [tab, setTab] = useState('generate'); // generate or scan
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { formatCurrency } = useFinance();

  const handleGenerate = (e) => {
    e.preventDefault();
    if(amount) setIsGenerated(true);
  };

  const handleScanSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="page animate-fade-in" style={{ paddingBottom: 'var(--space-24)' }}>
      <div className="header flex-start" style={{ paddingBottom: 'var(--space-16)' }}>
        <button onClick={onBack} style={{ background: 'var(--card-bg)', border: 'none', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
          <ArrowLeft size={20} className="text-main" />
        </button>
        <h1 className="title" style={{ marginLeft: 'var(--space-8)', fontSize: '20px' }}>QR chuyển tiền</h1>
      </div>

      <div className="flex-start" style={{ background: 'var(--card-bg)', padding: '6px', borderRadius: '20px', marginBottom: 'var(--space-24)', boxShadow: 'var(--shadow-sm)' }}>
        <button 
          className="button-primary" 
          style={{ flex: 1, padding: '12px', background: tab === 'generate' ? 'var(--primary)' : 'transparent', color: tab === 'generate' ? 'white' : 'var(--text-muted)', boxShadow: tab === 'generate' ? 'var(--shadow-sm)' : 'none', borderRadius: '16px', fontSize: '14px' }}
          onClick={() => { setTab('generate'); setIsGenerated(false); }}
        >
          <QrCode size={18} style={{ marginRight: 8 }} /> Tạo mã QR
        </button>
        <button 
          className="button-primary" 
          style={{ flex: 1, padding: '12px', background: tab === 'scan' ? 'var(--primary)' : 'transparent', color: tab === 'scan' ? 'white' : 'var(--text-muted)', boxShadow: tab === 'scan' ? 'var(--shadow-sm)' : 'none', borderRadius: '16px', fontSize: '14px' }}
          onClick={() => setTab('scan')}
        >
          <ScanLine size={18} style={{ marginRight: 8 }} /> Quét mã QR
        </button>
      </div>

      {tab === 'generate' ? (
        <div className="animate-fade-in">
          {!isGenerated ? (
            <div className="card" style={{ padding: 'var(--space-24)' }}>
              <form onSubmit={handleGenerate} className="flex-column" style={{ gap: 'var(--space-16)' }}>
                <div>
                  <label className="input-label">Số tiền</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Nội dung</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Chuyển tiền..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>
                <button type="submit" className="button-primary" style={{ marginTop: 'var(--space-8)' }}>
                  Tạo QR
                </button>
              </form>
            </div>
          ) : (
            <div className="card flex-column animate-fade-in" style={{ padding: 'var(--space-32)', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-color)', padding: 'var(--space-24)', borderRadius: '24px', marginBottom: 'var(--space-16)' }}>
                <QrCode size={160} color="var(--primary)" strokeWidth={1.5} />
              </div>
              <h2 className="amount large" style={{ color: 'var(--primary)' }}>{formatCurrency(amount)}</h2>
              <p className="text-muted" style={{ marginTop: 'var(--space-8)' }}>"{note || 'Chuyển khoản'}"</p>
              
              <button onClick={() => setIsGenerated(false)} className="button-primary" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginTop: 'var(--space-24)', boxShadow: 'none' }}>
                Tạo mã khác
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          {!isSuccess ? (
            <div className="card flex-column" style={{ padding: 'var(--space-24)', alignItems: 'center', background: 'var(--primary)', color: 'white' }}>
              <h3 style={{ marginBottom: 'var(--space-24)', fontWeight: 500 }}>Di chuyển camera vào mã QR</h3>
              
              <div style={{ width: 240, height: 240, border: '4px dashed rgba(255,255,255,0.4)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                 <ScanLine size={64} color="rgba(255,255,255,0.6)" />
                 {/* Scanner animation line can be added via CSS if desired, but kept minimal here */}
              </div>

              <div style={{ marginTop: 'var(--space-32)', width: '100%' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: 'var(--space-16)', borderRadius: '16px', marginBottom: 'var(--space-16)' }}>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>Người nhận</p>
                  <p style={{ fontWeight: 600, fontSize: '16px' }}>Nguyen Van A</p>
                  <div className="flex-between" style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '13px', opacity: 0.8 }}>Số tiền</p>
                    <p className="amount text-success" style={{ fontSize: '18px' }}>+$150</p>
                  </div>
                </div>
                <button className="button-primary" onClick={handleScanSuccess} style={{ background: 'white', color: 'var(--primary)' }}>
                  Xác nhận chuyển tiền
                </button>
              </div>
            </div>
          ) : (
            <div className="card flex-column animate-fade-in" style={{ padding: 'var(--space-32)', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '40px', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: 'var(--space-24)' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-8)' }}>Giao dịch thành công</h2>
              <p className="text-muted">Tiền đã được chuyển an toàn.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
