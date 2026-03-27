import React, { useState } from 'react';
import { Wallet, PieChart, Target, ChevronRight } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Quản lý chi tiêu dễ dàng',
      description: 'Đồng bộ và theo dõi mọi thu nhập, chi tiêu một cách minh bạch, an toàn.',
      icon: <Wallet size={80} strokeWidth={1.5} color="var(--primary)" />,
      bg: 'var(--primary-light)'
    },
    {
      title: 'Hiểu rõ dòng tiền',
      description: 'Làm chủ tài chính bằng báo cáo và phân tích chi tiêu vô cùng thông minh.',
      icon: <PieChart size={80} strokeWidth={1.5} color="var(--success)" />,
      bg: 'var(--success-light)'
    },
    {
      title: 'Đạt mục tiêu tài chính',
      description: 'Chủ động lập ngân sách và thiết lập quỹ tiết kiệm một cách hiệu quả nhất.',
      icon: <Target size={80} strokeWidth={1.5} color="var(--warning)" />,
      bg: 'rgba(255, 176, 32, 0.1)'
    }
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="page animate-fade-in flex-column" style={{ padding: 0, justifyContent: 'space-between', height: '100dvh', background: 'var(--card-bg)' }}>
      {/* Top right Skip button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-24)' }}>
        <button onClick={onComplete} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>Bỏ qua</button>
      </div>

      {/* Center content */}
      <div className="flex-column animate-fade-in" key={step} style={{ alignItems: 'center', textAlign: 'center', padding: '0 var(--space-32)' }}>
        <div style={{ width: 240, height: 240, background: slides[step].bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-32)' }}>
          {slides[step].icon}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginBottom: 'var(--space-16)', letterSpacing: '-0.02em' }}>
          {slides[step].title}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {slides[step].description}
        </p>
      </div>

      {/* Bottom controls */}
      <div style={{ padding: 'var(--space-32)', paddingBottom: 'calc(var(--space-32) + env(safe-area-inset-bottom))' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-32)' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? 'var(--primary)' : 'var(--border-color)', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        <button onClick={handleNext} className="button-primary" style={{ padding: '18px', fontSize: '16px', display: 'flex', gap: '8px', boxShadow: 'var(--shadow-lg)' }}>
          {step === 2 ? 'Bắt đầu' : 'Tiếp tục'} {step !== 2 && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
