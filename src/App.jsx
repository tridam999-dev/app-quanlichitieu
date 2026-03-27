import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import QRTransfer from './pages/QRTransfer';
import Onboarding from './pages/Onboarding';
import AIChat from './pages/AIChat';
import { useFinance } from './context/FinanceContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { settings, updateSettings } = useFinance();

  if (!settings?.hasSeenOnboarding) {
    return <Onboarding onComplete={() => updateSettings({ hasSeenOnboarding: true })} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'transactions': return <Transactions />;
      case 'budget': return <Budget />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'qr': return <QRTransfer onBack={() => setActiveTab('dashboard')} />;
      case 'ai-chat': return <AIChat onBack={() => setActiveTab('dashboard')} />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
